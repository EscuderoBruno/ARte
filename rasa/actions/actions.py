# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

import requests
import json
from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.events import FollowupAction
from rasa_sdk.executor import CollectingDispatcher

class ActionJuegoCargarPreguntas(Action):

    def name(self) -> Text:
        return "action_juego.cargarPreguntas"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            juego_id = tracker.get_slot("juego_id")

            print(f"Cargando juego: {juego_id}")

            try:
                response = requests.get(f"https://arte.ovh/api/juego/{juego_id}")
                response.raise_for_status()  # Lanza una excepción para errores HTTP
                juego = response.json()  # Suponiendo que la respuesta es en formato JSON
                nombre_juego = juego.get("nombre")
                descripcion_juego = juego.get("descripcion")
                nombre = tracker.get_slot("nombre")
                if not nombre:
                    nombre = "explorador/a"
                dispatcher.utter_message(f"Hola, {nombre}! El juego está a punto de comenzar.")
                dispatcher.utter_message("Para cualquier duda pulsa sobre el botón de información de arriba a la derecha.")
                juego_str = json.dumps(juego)
                return [SlotSet("juego", juego_str)]

            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al obtener el juego de la base de datos.")

            return []

class ActionJuegoSiguientePregunta(Action):

    def name(self) -> Text:
        return "action_juego.siguientePregunta"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Siguiente pregunta...")

            pregunta_idx = tracker.get_slot("pregunta_actual")
            juego_str = tracker.get_slot("juego")

            juego = json.loads(juego_str)
            if pregunta_idx + 1 < len(juego["Pregunta"]):
                pregunta_idx = int(pregunta_idx) + 1
                dispatcher.utter_message("Command: siguiente")
                dispatcher.utter_message("Avanzando a la siguiente pieza...")
                dispatcher.utter_message(f"Pieza número {pregunta_idx + 1}")
                return [SlotSet("pregunta_actual", pregunta_idx), FollowupAction("utter_juego.preguntar")]
            else:
                dispatcher.utter_message("Estás en la última pieza del juego.")
                dispatcher.utter_message(text="¿Quieres rendirte y acabar el juego?", buttons=[
                        {
                            "title": "Acabar juego",
                            "payload": "Quiero acabar el juego"
                        }
                    ])
    

class ActionJuegoComprobarRespuesta(Action):

    def name(self) -> Text:
        return "action_juego.comprobar"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Comprobando...")

            respuesta = tracker.get_slot("respuesta")
            pregunta_idx = tracker.get_slot("pregunta_actual")
            print(pregunta_idx)
            puntos = tracker.get_slot("puntos")
            juego_str = tracker.get_slot("juego")

            juego = json.loads(juego_str)
            pregunta = juego["Pregunta"][pregunta_idx]
            print(respuesta)
            print(pregunta['pieza']['id'])
            if(respuesta == pregunta['pieza']['id']):
                dispatcher.utter_message("Command: acierto")
                dispatcher.utter_message("¡Muy bien! Respuesta correcta.")
                if (pregunta_idx + 1) >= len(juego["Pregunta"]):
                    return [SlotSet('puntos', puntos + 1), FollowupAction("action_juego.finalizar")]
                else:
                    return [ SlotSet('puntos', puntos + 1), FollowupAction("utter_juego.acierto")]
            else:
                dispatcher.utter_message("Command: fallo")
                dispatcher.utter_message("¡Lastima! Esa no es la pieza de la imagen.")
                dispatcher.utter_message("Aunque aún puedes seguir intentandolo.")
                if (pregunta_idx + 1) < len(juego["Pregunta"]):
                    dispatcher.utter_message(text="¿Quieres rendirte y pasar a la siguiente pregunta?", buttons=[
                        {
                            "title": "Siguiente pieza",
                            "payload": "Siguiente pregunta"
                        }
                    ])
                else:
                    dispatcher.utter_message(text="¿Quieres rendirte y acabar el juego?", buttons=[
                        {
                            "title": "Acabar juego",
                            "payload": "Quiero acabar el juego"
                        }
                    ])
            return []

class ActionJuegoInformacionPieza(Action):

    def name(self) -> Text:
        return "action_juego.informacion"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Informacion pieza...")

            juego_str = tracker.get_slot("juego")
            juego = json.loads(juego_str)
            pregunta = juego["Pregunta"][0]
            print(pregunta['pieza']['informacion'])
            infos = pregunta['pieza']['informacion']
            for info in infos:
                if info['idioma_id'] == 'es':
                    dispatcher.utter_message(f"Recibido. Aquí esta la información de esta pieza: {info['nombre']}.\n{info['texto_facil']}")
                    pregunta_idx = tracker.get_slot("pregunta_actual")
                    juego_str = tracker.get_slot("juego")

                    juego = json.loads(juego_str)
                    if pregunta_idx + 1 < len(juego["Pregunta"]):
                         return [FollowupAction("action_juego.siguientePregunta")]
                    else:
                         dispatcher.utter_message(text="Cuando estes listo para ver los resultados pulsa el botón o dímelo.", buttons=[
                            {
                                "title": "Ver resultados",
                                "payload": "Quiero ver los resultados"  
                            },
                         ])
                         
                        
            return []

class ActionJuegoFinalizar(Action):

    def name(self) -> Text:
        return "action_juego.finalizar"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Finalizando juego...")

            pregunta_idx = tracker.get_slot("pregunta_actual")
            juego_str = tracker.get_slot("juego")
            juego = json.loads(juego_str)
            pregunta_idx = len(juego["Pregunta"]) - 1


            nombre = tracker.get_slot("nombre")
            if not nombre:
               nombre = "explorador/a"
            
            puntos = tracker.get_slot("puntos")
            if not puntos:
               puntos = 0

            puntos_str = 'puntos'
            if puntos == 1:
                 puntos_str = 'punto'
            dispatcher.utter_message(f"El juego ha finalizado. ¡Enhorabuena {nombre}!")
            dispatcher.utter_message(f"Command: final")
            dispatcher.utter_message(text="¿Quieres ver más información de la última pieza o deseas ver los resultados?", buttons=[
                 {
                    "title": "Ver más información",
                    "payload": "Mas información"  
                 },
                 {
                    "title": "Ver resultados",
                    "payload": "Quiero ver los resultados"  
                 },
            ])

            return [SlotSet("pregunta_actual", pregunta_idx)]