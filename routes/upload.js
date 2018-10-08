var express = require('express');

var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de colecciones

    var tiposValidos = ["usuarios", "medicos", "hospitales"];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no valida',
            errors: { message: 'tipo de coleccion no valida' }
        });

    }

    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'debe seleccionar una imagen' }
        });


    }

    // obtener nombre del archivo 

    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');

    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // solo estas extensiones son peritidas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extensio no valida',
            errors: { message: 'Las extensiones validas son:' + extensionesValidas.join(', ') }
        });

    }

    // nombre archivo personalizado

    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;


    // Mover archivo temporar a una ruta 
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mmover el archivo ',
                errors: err
            });



        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({

        //     ok: true,
        //     mensaje: 'archivo movido',
        //     extensionArchivo: extensionArchivo
        // });

    });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {




    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);

            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ":D";

                return res.status(200).json({

                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });


            })



        });


    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no existe',
                    errors: { message: 'medico no existe' }
                });

            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);

            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({

                    ok: true,
                    mensaje: 'imagen de medico actualizada',
                    medico: medicoActualizado
                });


            })



        });

    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    errors: { message: 'hospital no existe' }
                });

            }

            var pathViejo = './uploads/usuarios/' + hospital.img;

            // si existe elimina la imagen anterior

            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);

            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                hospitalActualizado.password = ":D";

                return res.status(200).json({

                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    usuario: hospitalActualizado
                });


            })



        });

    }



}

module.exports = app;