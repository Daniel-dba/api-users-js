TRABAJO FINAL MODULO 3 NOCIONES DE PROGRAMACION DIPLOMADO FULL STACK USIP
	API-REST  TRABAJO FINAL PARA ADMINISTRAR USUARIOS
Se ejecuta el siguiente comando en la terminal para levantar docker
_ docker run –dip-pg -e POSTGRES_PASSWORD=postgres -p 54322:5432 postgres:12

Se ejecutan los siguientes comandos 
_ docker volume create portainer_data
_ docker volume ls
_ docker image ls
Verificamos si esta levantado Docker
 
 
Creamos la carpeta api-users-js con el siguiente comando
cd api-users-js
Después de añadir la carpeta node_modules, creamos los packaje json con los siguientes comandos
_ npm init   (Colocamos los datos del proyecto como autor, descripción, etc y luego damos yes en la pregunta: Is this OK? (yes) yes)
_ type package.json
Terminada la instalación anterior, añadimos los siguientes comandos
npm install express
npm install pg
Con el comando dir verificamos los directorios creados 
 
En VSCode adicionamos el archivo index.js
 
En DBeaver Creamos nuestra base de datos usuarios_db
 
Creación de tablas y script
----DB usuarios---
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    ci INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL
);

-- Insertar datos en la tabla de usuarios---
INSERT INTO usuarios (ci,nombre, primer_apellido , segundo_apellido , fecha_nacimiento)
VALUES 
 (8002762, 'Daniel', 'Butron', 'Alvarez', '1990-12-28'),
 (8002763, 'Emma', 'Ruiz', 'Cardona', '1994-03-12'),
 (8002764, 'Zacarias', 'Flores', 'De La Fuente', '2000-10-10'),
 (8002765, 'Armando', 'Paredes', 'Rojas', '1992-11-11'),
 (8002766, 'Humberto', 'Butron', 'Gandarillas', '1959-09-23');


--promedio--
SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(), 
fecha_nacimiento))) AS promedio_edades FROM usuarios

 
 
 
 

//////index.js/////////////
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usuarios_db",
  password: "postgres",
  port: "54322",
});

// Modelo
class Model {
  async getUsuarios() {
    const { rows } = await pool.query("select * from usuarios;");
    return rows;
  }

  async getUsuarioById(id) {
    const { rows } = await pool.query("select * from usuarios where id = $1;", [
      id,
    ]);
    return rows[0];
  }

  async getPromedioUsuarioById(fecha_nacimiento) {
    const { rows } = await pool.query("select * from usuarios where fecha_nacimiento = $1;", [
      fecha_nacimiento,
    ]);
    return rows[0];
  }



  async addUsuario(ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento) {
    await pool.query("INSERT INTO usuarios (ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento) values ($1,$2,$3,$4,$5)", [ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento]);
  }

  async updateUsuario(id,ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento) {
    await pool.query("UPDATE usuarios SET ci = $2, nombre = $3, primer_apellido = $4, segundo_apellido = $5, fecha_nacimiento = $6, WHERE id = $1 ", [id,ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento]);
  }

  async deleteUsuario(id) {
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
  }
}

//Controlador
class Controller {
  constructor(model) {
    this.model = model;
  }

  async getUsuarios(req, res) {
    const data = await this.model.getUsuarios();
    res.send(data);
  }

  async getUsuarioById(req, res) {
    const id = req.params.id;
    const data = await this.model.getUsuarioById(id);
    res.send(data);
  }

  async getPromedioUsuarioById(req, res) {
    const fecha_nacimiento = req.params.fecha_nacimiento;
    const promedio_edades = await this.model.getPromedioUsuarioById(fecha_nacimiento)
    res.send(promedio_edades);
  }


  async addUsuario(req, res) {
    const ci = req.body.ci;
    const nombre = req.body.nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    await this.model.addUsuario(ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento);
    res.sendStatus(201);
  }

  async updateUsuario(req, res) {
    const id = req.params.id;
    const ci = req.body.ci;
    const nombre = req.body.nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    await this.model.updateUsuario(id,ci,nombre,primer_apellido,segundo_apellido,fecha_nacimiento);
    res.sendStatus(200);
  }

  async deleteUsuario(req, res) {
    const id = req.params.id;
    await this.model.deleteUsuario(id);
    res.sendStatus(200);
  }

  async getUsuarios2(req,res) {
    res.send({nameSystem: "api-users-js", version: "0.0.1", developer:"Fernando Daniel Butron Alvarez ", email: "danielosky.butron.alvarez@gmail.com"});
  }


}


//Instanciación
const model = new Model();
const controller = new Controller(model);

app.use(express.json());

app.get("/usuarios", controller.getUsuarios.bind(controller));
app.get("/usuarios/:id", controller.getUsuarioById.bind(controller));
app.get("/usuarios/:promedio_edades", controller.getPromedioUsuarioById.bind(controller));
app.post("/usuarios", controller.addUsuario.bind(controller));
app.put("/usuarios/:id", controller.updateUsuario.bind(controller));
app.delete("/usuarios/:id", controller.deleteUsuario.bind(controller));


app.get("/usuarios2", controller.getUsuarios2.bind(controller));///estado


app.listen(port, () => {
  console.log(`Este servidor se ejecuta en http://localhost:${port}`);
});


app.get("/usuarios2", controller.getUsuarios2.bind(controller));


app.listen(port, () => {
  console.log(`Este servidor se ejecuta en http://localhost:${port}`);
});

En terminal de VsCode ejecutar los siguientes comandos
docker ps
node index.js
 
En el browser se verifica la conexión a la base de datos
 

Mediante postman, se verifica el funcionamiento del crood 

 Nota: El Informe final con capturas de pantalla fue enviado al correo: juanc.con@gmail.com y al google classroom
 
 
 
 
 
 
 
