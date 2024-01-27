DROP DATABASE IF EXISTS Solutio;
CREATE SCHEMA IF NOT EXISTS Solutio;
USE Solutio;

/*  Registra todo usuario que vaya a entrar al sistema  */
CREATE TABLE IF NOT EXISTS tblUsuario (
    rut_usuario varchar(12) primary key unique,
    nombre varchar(45),
    apellido_paterno varchar(45),
    apellido_materno varchar(45),
    correo varchar(100) unique,
    usuario varchar(20) unique,
    contrasena char(100),
    nacionalidad varchar(30),
    estado_cuenta varchar(15),
    tipo_cuenta varchar(20),
    token varchar(200) unique,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP
);

/*  Describe el perfil del técnico  */
CREATE TABLE IF NOT EXISTS tblTecnico (
    rut_usuario varchar(12),
    habilidad varchar(100),
    descripcion_habilidad varchar(100),
    puntuacion_habilidad float,
    CONSTRAINT fk_rut_tecnico FOREIGN KEY (rut_usuario) REFERENCES tblUsuario(rut_usuario)
);

CREATE TABLE IF NOT EXISTS tblChat (
    id_chat INT AUTO_INCREMENT PRIMARY KEY,
    rut_cliente varchar(12),
    rut_usuario varchar(12),
    mensaje text,
    fecha_envio timestamp DEFAULT CURRENT_TIMESTAMP,
    leido boolean DEFAULT false,
	CONSTRAINT fk_rut_usuario FOREIGN KEY (rut_usuario) REFERENCES tblUsuario(rut_usuario),
    CONSTRAINT fk_rut_cliente FOREIGN KEY (rut_cliente) REFERENCES tblUsuario(rut_usuario)
);

/*  Ticket creado por el usuario  */
CREATE TABLE IF NOT EXISTS tblTicket (
	id_detalle int primary key auto_increment,
    id_ticket int,
    rut_usuario varchar(12),
    descripcion varchar(2000),
    valor_trabajo int,
    pagado varchar(15),
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rut_orden_usuario FOREIGN KEY (rut_usuario) REFERENCES tblUsuario(rut_usuario)
);

/*  Historial de peticiones a la BD  */
CREATE TABLE IF NOT EXISTS tblLog (
    id_log int primary key auto_increment,
    tipo_log varchar(50),
    fecha datetime,
    descripcion varchar(2000)
);

/*  Se asigna un técnico para la solución del cliente  */
CREATE TABLE IF NOT EXISTS tblAsigna_ticket (
    id int primary key auto_increment,
    id_detalle int,
    rut_tecnico varchar(12),
    CONSTRAINT fk_rut_tecnico_orden_usuario FOREIGN KEY (rut_tecnico) REFERENCES tblUsuario(rut_usuario),
    CONSTRAINT fk_id_orden_orden_usuario FOREIGN KEY (id_detalle) REFERENCES tblTicket(id_detalle)
);

/*  Tarjeta del usuario con la que va a pagar  */
CREATE TABLE IF NOT EXISTS tblCartera_cliente (
    id_cuenta int primary key auto_increment,
    rut_usuario varchar(12) unique,
    monto int,
    CONSTRAINT fk_rut_usuario_cartera FOREIGN KEY (rut_usuario) REFERENCES tblUsuario(rut_usuario)
);

-- use solutio;
SELECT * FROM tblCartera_cliente;
SELECT * FROM tblAsigna_ticket;
SELECT * FROM tblLog;
SELECT * FROM tblTicket;
SELECT * FROM tblTecnico;
SELECT * FROM tblUsuario;
SELECT * FROM tblChat;

-- Insertar datos en tblUsuario
INSERT INTO tblUsuario (rut_usuario, nombre, correo, usuario, contrasena, nacionalidad, estado_cuenta, tipo_cuenta) 
VALUES 
('76056545-4', 'Soporte', 'solutiotechoficial@gmail.com', 'Soporte', '$2b$10$EHh6asHC6zY2fMOI0N4sSO8Er6zFgO9Jd2u3KNa9k62us1s4cMszS', 'CHILE', 'ACTIVA', 'SOPORTE'),
('11222333-5', 'tecnico', 'tencnico.solutio@gmail.com' ,'tecnico', '$2b$10$5vnZ9V0ipuqO981vRqrFXenPMta30Hfgie9J6Bm.cRAcSEOELWROW', 'CHILE', 'ACTIVA', 'CLIENTE');