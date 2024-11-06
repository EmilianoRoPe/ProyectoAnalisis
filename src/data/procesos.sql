# Usuario Registro
DROP PROCEDURE IF EXISTS UsuarioRegistro;
DROP PROCEDURE IF EXISTS UsuarioValidarCuenta;
DROP PROCEDURE IF EXISTS UsuarioRegistroGoogle;
DROP PROCEDURE IF EXISTS UsuarioRegistroFacebook;
# Usuario Inicio de Sesión
DROP PROCEDURE IF EXISTS UsuarioIniciarSesion;
DROP PROCEDURE IF EXISTS UsuarioIniciarSesionGoogle;
DROP PROCEDURE IF EXISTS UsuarioIniciarSesionFacebook;
# Usuario Preferencias
DROP PROCEDURE IF EXISTS UsuarioAñadirDeseado;
DROP PROCEDURE IF EXISTS UsuarioVerDeseados;
DROP PROCEDURE IF EXISTS UsuarioVerFavoritos;
# Lugar
DROP PROCEDURE IF EXISTS LugarRegistro;

DELIMITER //

-- ---------------------------------------------------------------------------------------------------
--                                         USUARIO REGISTRO
-- ---------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioRegistro`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioRegistro (
   IN p_nombre VARCHAR(255),
   IN p_correo VARCHAR(320),
   IN p_contraseña VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE correo = UPPER(p_correo);
    
   IF usuarioExistente = 0 THEN
      INSERT INTO Usuario (nombre, correo, contraseña, auditoria, confirmacion)
      VALUES (p_nombre, UPPER(p_correo), p_contraseña, NOW(), 0);
   ELSE
      SIGNAL SQLSTATE '45000' 
         SET MESSAGE_TEXT = 'El correo ya está registrado.';
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioCrearTokenValidacion`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioValidarCuenta (
   IN p_correo VARCHAR(320)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE correo = UPPER(p_correo);
    
   IF usuarioExistente = 0 THEN
      SIGNAL SQLSTATE '45000' 
         SET MESSAGE_TEXT = 'No existe el correo';
   ELSE
      UPDATE Usuario SET confirmacion = 1
      WHERE correo = UPPER(p_correo);
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioRegistroGoogle`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioRegistroGoogle (
   IN p_nombre VARCHAR(255),
   IN p_correo VARCHAR(320),
   IN p_imagen VARCHAR(255),
   IN p_token VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE correo = UPPER(p_correo);
    
   IF usuarioExistente = 0 THEN
      INSERT INTO Usuario (nombre, correo, ligaFotoPerfil, tokenGoogle, confirmacion, auditoria)
      VALUES (p_nombre, UPPER(p_correo), p_imagen, p_token, 1, NOW());

      SELECT id FROM Usuario
      WHERE nombre = p_nombre AND correo = UPPER(p_correo);
      
   ELSE
      SELECT 'correo_ya_registrado' AS 'error';
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioRegistroFacebook`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioRegistroFacebook (
   IN p_nombre VARCHAR(255),
   IN p_token VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE tokenFacebook = p_token;
    
   IF usuarioExistente = 0 THEN
      INSERT INTO Usuario (nombre, tokenFacebook, confirmacion, auditoria)
      VALUES (p_nombre, p_token, 1, NOW());

      SELECT id FROM Usuario
      WHERE tokenFacebook = p_token;
      
   ELSE
      SELECT 'correo_ya_registrado' AS 'error';
   END IF;
END //

-- ---------------------------------------------------------------------------------------------------
--                                        USUARIO INICIAR SESIÓN
-- ---------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Process `AppTurismo`.`IniciarSesion`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioIniciarSesion (
   IN p_correo VARCHAR(320),
   IN p_contraseña VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;
   DECLARE contraseñaCorrecta INT;
   DECLARE confirmacion_ INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE correo = UPPER(p_correo);
   
   IF usuarioExistente = 0 THEN
      SELECT 'correo_no_registrado' AS 'error';
   ELSE
	SELECT id, contraseña, confirmacion FROM Usuario
        WHERE correo = UPPER(p_correo);
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioIniciarSesionGoogle`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioIniciarSesionGoogle (
   IN p_correo VARCHAR(320),
   IN p_token VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE tokenGoogle = p_token;
   
   IF usuarioExistente = 0 THEN
      SELECT 'correo_no_registrado' AS 'error';
   ELSE
	SELECT id FROM Usuario
        WHERE tokenGoogle = p_token;
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioIniciarSesionFacebook`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioIniciarSesionFacebook (
   IN p_token VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;

   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE tokenFacebook = p_token;
   
   IF usuarioExistente = 0 THEN
      SELECT 'correo_no_registrado' AS 'error';
   ELSE
	SELECT id FROM Usuario
        WHERE tokenFacebook = p_token;
   END IF;
END //

-- ---------------------------------------------------------------------------------------------------
--                                         USUARIO PREFERENCIAS
-- ---------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioAñadirDeseado`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioAñadirDeseado (
   IN p_idUsuario VARCHAR(255),
   IN p_idLugar VARCHAR(255)
)
BEGIN
   DECLARE usuarioExistente INT;
   DECLARE lugarExistente INT;
   
   SELECT COUNT(*) INTO usuarioExistente
   FROM Usuario
   WHERE id = p_idUsuario;
   
   IF usuarioExistente = 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Error: El usuario no existe.';
   END IF;   
   
   SELECT COUNT(*) INTO lugarExistente
   FROM Lugar
   WHERE id = p_idLugar;
   
   IF lugarExistente = 0 THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Error: El lugar no existe.';
   END IF;
   
   IF usuarioExistente = 1 AND lugarExistente = 1 THEN
      INSERT INTO LugarDeseado (idUsuario, idLugar, auditoria)
      VALUES (p_idUsuario, p_idLugar, NOW());
   END IF;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioVerDeseados`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioVerDeseados (
   IN p_id INT
)
BEGIN
   SELECT
      l.nombre AS nombre,
      l.descripcion AS descripcion,
      l.direccion AS direccion,
      l.costo AS costo
      #AVG()
   FROM LugarDeseado
   JOIN Lugar l ON LugarDeseado.idLugar = l.id
   WHERE LugarDeseado.idUsuario = p_id;
END //

-- -----------------------------------------------------
-- Process `AppTurismo`.`UsuarioVerFavoritos`
-- -----------------------------------------------------

CREATE PROCEDURE UsuarioVerFavoritos (
   IN p_id INT
)
BEGIN
   SELECT
      l.nombre AS nombre,
      l.descripcion AS descripcion,
      l.direccion AS direccion,
      l.costo AS costo
      #AVG()
   FROM LugarFavorito
   JOIN Lugar l ON LugarFavorito.idLugar = l.id
   WHERE LugarFavorito.idUsuario = p_id;
END //

-- ---------------------------------------------------------------------------------------------------
--                                               LUGARES
-- ---------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Process `AppTurismo`.`LugarRegistro`
-- -----------------------------------------------------

CREATE PROCEDURE LugarRegistro (
   IN p_nombre VARCHAR(255),
   IN p_descripcion VARCHAR(255),
   IN p_direccion VARCHAR(255)
)
BEGIN
   DECLARE lugarExistente INT;

   SELECT COUNT(*) INTO lugarExistente
   FROM Lugar
   WHERE nombre = p_nombre;
    
   IF lugarExistente = 0 THEN
      INSERT INTO Lugar (nombre, descripcion, direccion, auditoria)
      VALUES (p_nombre, p_descripcion, p_direccion, NOW());
   ELSE
      SIGNAL SQLSTATE '45000' 
         SET MESSAGE_TEXT = 'El lugar ya está registrado.';
   END IF;
END //

DELIMITER ;