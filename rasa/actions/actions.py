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

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            juego_id = tracker.get_slot("juego_id")
            slots = tracker.current_slot_values()

            print("Cargando juego...")

            try:
                response = requests.get(f"http://localhost:3000/api/juego/{juego_id}")
                response.raise_for_status()  # Lanza una excepción para errores HTTP
                juego = response.json()  # Suponiendo que la respuesta es en formato JSON
                nombre_juego = juego.get("nombre")
                descripcion_juego = juego.get("descripcion")
                nombre = tracker.get_slot("nombre")
                dispatcher.utter_message(f"Muchas gracias {nombre}, ahora que sé tu nombre comencemos a jugar.")
                dispatcher.utter_message(f"Juego encontrado: {nombre_juego}, {descripcion_juego}")
                juego_str = json.dumps(juego)
                return [SlotSet("juego", juego_str), FollowupAction("action_juego.preguntar")]

            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al obtener el juego de la base de datos.")

            return []

class ActionJuegoSiguientePregunta(Action):

    def name(self) -> Text:
        return "action_juego.siguientePregunta"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Siguiente pregunta...")

            try:
                juego_str = tracker.get_slot("juego")
                juego = json.loads(juego_str)
                preguntas = juego["Pregunta"]
                if(len(preguntas) > 2):
                    juego["Pregunta"].pop(0)
                    juego_str = json.dumps(juego)
                    dispatcher.utter_message("Siguiente pregunta...")
                    return [SlotSet("juego", juego_str), FollowupAction("action_juego.preguntar")]
                else:
                    return [FollowupAction("action_juego.finalizar")]

            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al pasar a la siguiente pregunta.")

            return []
    
class ActionJuegoPreguntar(Action):

    def name(self) -> Text:
        return "action_juego.preguntar"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Preguntando...")

            try:
                juego_str = tracker.get_slot("juego")
                juego = json.loads(juego_str)
                pregunta = juego["Pregunta"][0]
                print(pregunta["pieza"]["imagen"])
                dispatcher.utter_message(f"¿Puedes encontrar la pieza que corresponde a la siguiente imagen? <imagen>{pregunta['pieza']['imagen']}</imagen>")

            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al hacer la pregunta.")

            return []

class ActionJuegoComprobarRespuesta(Action):

    def name(self) -> Text:
        return "action_juego.comprobar"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Comprobando...")

            try:
                respuesta = tracker.get_slot("respuesta")
                juego_str = tracker.get_slot("juego")
                juego = json.loads(juego_str)
                pregunta = juego["Pregunta"][0]
                if(respuesta == pregunta.pieza.id):
                    dispatcher.utter_message(f"¡Muy bien! Respuesta correcta. ¿Quieres continuar con la siguiente pregunta o obtener más información acerca de la pieza?")
                else:
                    dispatcher.utter_message(f"¡Lastima! Esa no es la pieza de la imagen. ¿Quieres intentarlo otra vez o quieres seguir con la siguiente pregunta?")
            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al hacer la pregunta.")

            return []

class ActionJuegoInformacionPieza(Action):

    def name(self) -> Text:
        return "action_juego.informacion"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Informacion pieza...")

            try:
                juego_str = tracker.get_slot("juego")
                juego = json.loads(juego_str)
                pregunta = juego["Pregunta"][0]
                info = pregunta.pieza.informacion["es"]
                dispatcher.utter_message(f"Recibido. Aquí esta la información de esta pieza: ${info.nombre}.\n${info.texto_facil}")
                dispatcher.utter_message(f"¿Quieres continuar a la siguiente pregunta?")
            except requests.exceptions.RequestException as e:
                # Manejar errores de la llamada a la API
                dispatcher.utter_message("Error al hacer la pregunta.")

            return []

class ActionJuegoFinalizar(Action):

    def name(self) -> Text:
        return "action_juego.finalizar"

    async def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

            print("Finalizando juego...")

            nombre = tracker.get_slot("nombre")
            if not nombre:
               nombre = "explorador"
            
            puntos = tracker.get_slot("puntos")
            if not puntos:
               puntos = 0

            dispatcher.utter_message(f"El juego ha finalizado. Enhorabuena ${nombre}, has conseguido ${puntos} puntos.")

            return []