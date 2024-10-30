const express = require('express');
const app = express();
const { PrismaClient } = require("@prisma/client"); 
const port = 3000;

const prisma = new PrismaClient();
app.use(express.json());

app.listen(port, () => {
    console.log("Server is running on port " + port);
});

app.get('/test', (req, res) => {
    res.send("Apa kabar dunia?");
});

// Alasan menggunakan Async Await karena melakukan proses validasi dari database
app.get('/catatan', async (req, res) => {
    const catatan = await prisma.catatan.findMany(); 

     res.status(200).send({
        data: catatan,
        messages: "Data berhasil diambil"
     })
});

app.post('/catatan', async (req, res) => {
    const dataCatatanBaru = req.body

    const catatanBaru = await prisma.catatan.create({
        data: {
            title: dataCatatanBaru.title,
            description: dataCatatanBaru.description,
            category: dataCatatanBaru.category,
        }
    })

    res.status(201).send({
        data: catatanBaru,
        messages: "Data berhasil dibuat!"
    })
});

// Semua data yang mau di update wajib diisi semua datanya
app.put('/catatan/:id', async (req, res) => {
    const catatanId = req.params.id
    const dataCatatan = req.body

    // jika salah satu data tidak diisi, maka akan muncul pesan error
    if (!dataCatatan.title || !dataCatatan.description || !dataCatatan.category) {
       res.status(400).send("Data tidak boleh ada yang kosong!")
    }

    const updateData = await prisma.catatan.update({
        where: {
            id: parseInt(catatanId)
        },

        data: {
            title: dataCatatan.title,
            description: dataCatatan.description,
            category: dataCatatan.category
        }
    })

    res.status(201).send({
        data: updateData,
        message: "Data berhasil di update"
    })
});

app.patch('/catatan/:id', async (req, res) => {
    const catatanId = req.params.id
    const dataCatatan = req.body

    const updateData = await prisma.catatan.update({
        where: {
            id: parseInt(catatanId)
        },

        data: {
            title: dataCatatan.title,
            description: dataCatatan.description,
            category: dataCatatan.category
        }
    })

    res.status(201).send({
        data: updateData,
        message: "Data berhasil di update"
    })
});

app.delete('/catatan/:id', async (req, res) => {
    const catatanId = req.params.id
    await prisma.catatan.delete({
        where: {
            id: parseInt(catatanId)
        },
    })
    res.status(200).send("data berhasil dihapus!")
});