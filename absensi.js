const pool = require('./dbCon');
const fs = require('fs');
const path = require('path');
const { param } = require('express/lib/request');
const base_url = process.env.base_url;

const create = (request, response) => {
    const id = parseInt(request.params.id);
    const { jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,kategori_absensi } 
    = request.body

    let sampleFile = request.files.photo;
    console.log(sampleFile);
    const now = Date.now()
    let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
    complete_path = base_url+'dokumens/absensi/'+name;
    console.log(__dirname);
    sampleFile.mv(path.join(__dirname + '/dokumens/absensi/') + name, function (err) {
        if (err)
            console.log(err);
    });

    pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,name,kategori_absensi],(error,results) => {
            if (error) {
                throw error
            }
            response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
    })
}

const read = (request, response) => {

    const id = parseInt(request.params.id);
    var res_array = [];
    var items = [];
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime1 = date +' '+'00:00:00';
    var dateTime2 = date+' '+time;

    pool.query('SELECT * from tbabsensi WHERE pegawaiid =$1 AND waktuabsen >= $2::timestamp  AND  waktuabsen <  $3::timestamp',[id,dateTime1,dateTime2],(error,results) => {
        if(results) {
                items.push({rows:results.rows})
                res_array.push(items)
                response.status(200).json( {success:true,data:res_array})
        }
    })    
}



module.exports = 
{
    create,
    read,
}