import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        let folder = '';
        console.log(file);
        switch (req.baseUrl.split('/').pop()) {
            case 'exposicion':
                folder = 'exposiciones';
                break;
            case 'piezas':
                switch (file.fieldname) {
                    case 'imagen':
                        folder = 'piezas/imagenes';
                        break;
                    case 'pictograma':
                        folder = 'piezas/pictogramas';
                        break;
                    case 'modelo':
                        folder = 'piezas/modelos';
                        break;
                    case 'textura':
                        folder = 'piezas/texturas';
                        break;
                    default:
                        break;
                }
                break;
            case 'info':
                folder = 'piezas/audios';
            default:
                break;
        }
        let uid;
        if(req.params.id){
            uid = req.params.id;
        }else{
            uid = uuidv4();
        }
        req.id = uid;
        // if(!fs.existsSync(folder)){
        //     fs.mkdir('./uploads/' + folder);
        // }
        let filePath = `${folder}/${uid}.${file.originalname.split('.').pop()}`;
        if(file.fieldname === 'audio'){
            filePath = `${folder}/${req.body.idioma_id}-${uid}.${file.originalname.split('.').pop()}`;
        }
        console.log('File path: ' + filePath);
        req[file.fieldname] = filePath;
        let files = fs.readdirSync('./uploads/' + folder);
        let fileNameWithoutExtension = req.id;
        if(file.fieldname === 'audio'){
            fileNameWithoutExtension = req.body.idioma_id + '-' + fileNameWithoutExtension;
        }
        files.forEach(existingFile => {
            let existingFileNameWithoutExtension = existingFile.split('.')[0];
            if(existingFileNameWithoutExtension === fileNameWithoutExtension) {
                fs.unlinkSync(path.join('./uploads/' + folder, existingFile));
            }
        })
        cb(null, filePath);
    }
})

const upload = multer({ storage });

export default upload;