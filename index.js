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
