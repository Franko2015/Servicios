DROP DATABASE IF EXISTS solutio;
CREATE SCHEMA IF NOT EXISTS solutio;
USE solutio;

/*  Registra todo usuario que vaya a entrar al sistema  */
CREATE TABLE IF NOT EXISTS system_users (
	id_user INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    rut_user VARCHAR(12) UNIQUE,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(20) UNIQUE NOT NULL,
    passwd CHAR(100) NOT NULL,
    nationality VARCHAR(30),
    account_status VARCHAR(15) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    token VARCHAR(200) UNIQUE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*  Describe el perfil del técnico  */
CREATE TABLE IF NOT EXISTS system_technical (
	id_user INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
    rut_user VARCHAR(12) UNIQUE,
    skill VARCHAR(100) NOT NULL,
    skill_description VARCHAR(100) NOT NULL,
    skill_rating FLOAT,
    CONSTRAINT fk_technician_rut FOREIGN KEY (rut_user)
        REFERENCES system_users (rut_user)
);

CREATE TABLE IF NOT EXISTS system_chat (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    id_user INT NOT NULL,
    message TEXT NOT NULL,
    send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    readed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_id FOREIGN KEY (id_user)
        REFERENCES system_users (id_user),
    CONSTRAINT fk_client_id FOREIGN KEY (client_id)
        REFERENCES system_users (id_user)
);

/*  Ticket created by the user  */
CREATE TABLE IF NOT EXISTS system_tickets (
    detail_ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id INT,
    id_user INT,
    description VARCHAR(2000),
    work_value INT,
    paid BOOLEAN,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_order_id FOREIGN KEY (id_user)
        REFERENCES system_users (id_user)
);

/*  History of requests to the DB  */
CREATE TABLE IF NOT EXISTS system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    log_type VARCHAR(50),
    full_date DATETIME,
    description VARCHAR(2000)
);

/*  A technician is assigned to solve the client's issue  */
CREATE TABLE IF NOT EXISTS system_tickets_assigned (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    detail_ticket_id INT,
    technician_id INT,
    CONSTRAINT fk_technician_order_id FOREIGN KEY (technician_id)
        REFERENCES system_users (id_user),
    CONSTRAINT fk_order_id_order_id FOREIGN KEY (detail_ticket_id)
        REFERENCES system_tickets (detail_ticket_id)
);

/*  User's card to pay with  */
CREATE TABLE IF NOT EXISTS system_wallet (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT UNIQUE,
    amount INT,
    CONSTRAINT fk_user_wallet_id FOREIGN KEY (id_user)
        REFERENCES system_users (id_user)
);


-- Insertar datos en tblUsuario
/* soporte {
	nombre: soporte
    contraseña: administracion123
}  tecnico {
    nombre: tecnico
    contraseña: tecnico
}
*/

INSERT INTO system_users (rut_user, full_name, email, username, passwd, nationality, account_status, account_type) 
VALUES 
('76056545-4', 'Soporte prueba', 'solutiotechoficial@gmail.com', 'soporte', '$2b$10$EHh6asHC6zY2fMOI0N4sSO8Er6zFgO9Jd2u3KNa9k62us1s4cMszS', 'Chile', 'ACTIVA', 'SOPORTE'),
('11222333-5', 'Tecnico prueba', 'tencnico.solutio@gmail.com' ,'tecnico', '$2b$10$5vnZ9V0ipuqO981vRqrFXenPMta30Hfgie9J6Bm.cRAcSEOELWROW', 'Chile', 'ACTIVA', 'TECNICO');

INSERT INTO system_technical (rut_user, skill, skill_description, skill_rating) values ('76056545-4', 'Desarrollador Web Front-end', '', 8.5);
-- INSERT INTO system_technical (rut_user, skill, skill_description, skill_rating) values ('11222333-5', 'Soporte de mesa de ayuda', '', 5.9);

INSERT INTO system_tickets (ticket_id, id_user, description, work_value, paid) VALUES (1, 1, '', 10000, 1);
INSERT INTO system_chat (client_id, id_user, message, readed) VALUES (1,2,'Hola que tal',false);

-- DELETE FROM system_users WHERE rut_user = '76056545-4';