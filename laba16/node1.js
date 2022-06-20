const mysql = require("mysql");

const express = require("express");
const app = express();
const mailer = require("./mailer");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

app.set("view engine", "hbs");

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "arapov",
    database: "laba3",
    password: "7055"
});

pool.getConnection(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

const urlencodedParser = express.urlencoded({ extended: false });

// основная страница

app.get("/", function (req, res) {
    pool.query("SELECT student.surname, student.imena, student.second_name, student_group.course_name, speciality.name FROM student JOIN student_group ON student.gruppa=student_group.id JOIN speciality on student_group.speciality=speciality.number;", function (err, data) {
        if (err) return console.log(err);
        res.render("glavnaya.hbs", {
            student: data
        });
    });
});

// добавление студента и вывод + почта

app.get("/createStudent", function (req, res) {
    pool.query("SELECT * FROM student_group", function (err, data) {
        if (err) return console.log(err);
        res.render("create.hbs", {
            student_group: data
        });
    });
});

app.post("/createStudent", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const surname = req.body.surname;
    const imena = req.body.imena;
    const second_name = req.body.second_name;
    const gruppa = req.body.gruppa;
    const birth = req.body.birth;
    const message = {
        from: "Nikolay <nikolai1234509@mail.ru>",
        to: "sa50_n.a.arapov@mpt.ru", 
        subject: "Добавление", 
        html: `<b>Добавлен новый студент!<br>
        Фамилия: ${req.body.surname}<br>
        Имя: ${req.body.imena}<br>
        Отчество: ${req.body.second_name}<br>
        Группа: ${req.body.gruppa}<br>
        Год рождения: ${req.body.birth}</b>`
        };
    mailer(message)
    pool.query("INSERT INTO student (surname, imena, second_name, gruppa, birth ) VALUES (?,?,?,?,?)", [surname, imena, second_name, gruppa, birth], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

// создание группы

app.get("/createGroup", function (req, res) {
    pool.query("SELECT * FROM speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("creategroup.hbs", {
            speciality: data
        });
    });
});

app.post("/createGroup", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const course_name = req.body.course_name;
    const course_number = req.body.course_number;
    const speciality = req.body.speciality;
    pool.query("INSERT INTO student_group (course_name, course_number, speciality ) VALUES (?,?,?)", [course_name, course_number, speciality], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

// посмотреть группы

app.get("/grouptable", function (req, res) {
    pool.query("SELECT * FROM student_group join speciality on student_group.speciality=speciality.number;", function (err, data) {
        if (err) return console.log(err);
        res.render("grouptable.hbs", {
            student_group: data
        });
    });
});

// создать специальность

app.get("/createSpeciality", function (req, res) {
    pool.query("SELECT * FROM speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("createSpeciality", {
            speciality: data
        });
    });
});

app.post("/createSpeciality", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    pool.query("INSERT INTO speciality (name) VALUES (?)", [name], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

// просмотр специальности

app.get("/tableSpeciality", function (req, res) {
    pool.query("SELECT * FROM speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("specialityTable.hbs", {
            speciality: data
        });
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});