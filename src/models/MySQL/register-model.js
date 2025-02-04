const { errorHandler } = require('../../pagesHandlers/error-handler');
const db = require('./db');

class registerModel{

  static async registroRegular(nombre, correo, contraseña){
    const query = 'CALL UsuarioRegistro (?, ?, ?);';
    return new Promise((resolve, reject) => {
      db.query(query, [nombre, correo, contraseña], (err, results) => {
        if (err) {
          reject(err);
        }
        const resultado = results[0][0] || null;
        if (resultado && resultado.error)
          return reject(new Error(resultado.error));
        else if(resultado && resultado.warning)
          resolve({ warning: resultado.warning });
        resolve({ id: resultado ? resultado.id : null });
      });
    });
  }

  static async registroGoogle(nombre, apellido, correo, imagen, token){
    const query = 'CALL UsuarioRegistroGoogle (?, ?, ?, ?, ?);';
    return new Promise((resolve, reject) => {
      db.query(query, [nombre, apellido, correo, imagen, token], (err, results) => {
        if (err) {
          return reject(err);
        }
        const resultado = results[0][0] || null;
        if (resultado && resultado.error)
          return reject(new Error(resultado.error));
        if(!resultado)
          return reject(new Error(''))
        resolve({ id: resultado ? resultado.id : null}); // { id: resultado ? resultado.id : null}*/
      });
    });
  }

  static async registroFacebook(nombre, imagen, facebookId) {
    const query = 'CALL UsuarioRegistroFacebook (?, ?, ?);';
    return new Promise((resolve, reject) => {
      db.query(query, [nombre, imagen, facebookId], (err, results) => {
        if (err) {
          reject(err);
        }
        const resultado = results[0][0] || null;
        if (resultado && resultado.error)
          return reject(new Error(resultado.error));
        resolve({ id: resultado ? resultado.id : null});
      });
    });
  }

  // Actualizar el campo confirmacion de la tabla usuario a 1
  static async confirmarCuenta(correo) {
    const query = 'CALL UsuarioConfirmarCuenta (?);';
    return new Promise((resolve, reject) => {
      db.query(query, correo, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

}

module.exports = registerModel;