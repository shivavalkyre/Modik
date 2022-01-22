const pool = require('./dbCon');
const fs = require('fs');
const path = require('path');
const { param } = require('express/lib/request');
const base_url = process.env.base_url;

const create = (request, response) => {
    const id = parseInt(request.params.id);
    const { jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,kategori_absensi } 
    = request.body

    // lokasi radius
    // komparasi latlon input dengan param
    // jenis_absensi 1=WFO;2=WFH;3=Dinas Luar;
    // id=pegawai id
    var radius ;
    var latitude_loc;
    var longitude_loc;
    var distance;

    console.log(kategori_absensi);

    if (kategori_absensi=='WFO') //wfo
    {
        if (id!==148){
            pool.query('SELECT radius FROM tbradius_absensi WHERE location=$1',['Navigasi'],(error,results) =>{
                if(results) {
                    radius = results.rows[0].radius;
                    console.log(radius)
                     // get latlon office by pegawaiid
                     pool.query('SELECT latitude_office,longitude_office FROM tbmpegawai WHERE pegawaiid=$1',[id],(error1,results1) =>{
                        if(results1){
    
                            latitude_loc = results1.rows[0].latitude_office;
                            longitude_loc = results1.rows[0].longitude_office;
    
                            console.log(latitude_loc);
                            console.log(longitude_loc);
    
                            console.log(latitude_abs);
                            console.log(longitude_abs);
    
                            distance= getDistanceFromLatLonInKm(latitude_loc,longitude_loc,latitude_abs,longitude_abs).toFixed(1);
                            console.log(distance);
    
                            if(distance<=radius){
                                
                                console.log(latitude_loc);
                                console.log(longitude_loc);
        
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
        
                                pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,name,kategori_absensi],(error3,results3) => {
                                    if (error3) {
                                        throw error3
                                    }
                                    response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
                                })
        
                            }else{
                                response.status(400).json({success:false,data: "absensi gagal dilakukan jarak terlalu jauh dari yang diijinkan" });
                            }
    
                           
                        }
                     })
                }
               
            })
        }else{
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
                
                pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,name,kategori_absensi],(error3,results3) => {
                    if (error3) {
                        throw error3
                    }
                    response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
                })
        }

    }else if(kategori_absensi=='WFH') //wfh
    {
        if(id!==148)
        {
            pool.query('SELECT radius FROM tbradius_absensi WHERE location=$1',['Rumah'],(error,results) =>{
                if(error){
                    throw error;
                }
                if(results) {
                    radius = results.rows[0].radius;
                    console.log(radius)
                     // get latlon home by pegawaiid
                     pool.query('SELECT latitude_rumah,longitude_rumah FROM tbmpegawai WHERE pegawaiid=$1',[id],(error1,results1) =>{
                        if(results1){
                            latitude_loc = results1.rows[0].latitude_rumah;
                            longitude_loc = results1.rows[0].longitude_rumah;
                            
                            distance= getDistanceFromLatLonInKm(latitude_loc,longitude_loc,latitude_abs,longitude_abs).toFixed(1);
                            console.log(distance);
    
                            if(distance<=radius){
                                
                                console.log(latitude_loc);
                                console.log(longitude_loc);
        
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
        
                                pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,name,kategori_absensi],(error3,results3) => {
                                    if (error3) {
                                        throw error3
                                    }
                                    response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
                                })
        
                            }else{
                                response.status(400).json({success:false,data: "absensi gagal dilakukan jarak terlalu jauh dari yang diijinkan" });
                            }
    
                           
                        }
                    })
                }
            })
        }else{
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
            
            pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,name,kategori_absensi],(error3,results3) => {
                if (error3) {
                    throw error3
                }
                response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
            })
        }
    }else{

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
        
        pool.query('INSERT INTO tbabsensi (pegawaiid,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude,longitude,urlfoto,kategori_absensi) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,jenisabsensi,waktuabsen,jenisautentikasi,snmesin,lokasi,latitude_abs,longitude_abs,name,kategori_absensi],(error3,results3) => {
            if (error3) {
                throw error3
            }
            response.status(200).json({success:true,data: "absensi baru berhasil dibuat" });
        })
    }

    




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


const readbyid = (request, response) => {

    const id = parseInt(request.params.id);
    var res_array = [];
    var items = [];
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime1 = date +' '+'00:00:00';
    // var dateTime2 = date+' '+time;

    pool.query('SELECT * from tbabsensi WHERE id =$1',[id],(error,results) => {
        if(results) {
                items.push({rows:results.rows})
                res_array.push(items)
                response.status(200).json( {success:true,data:res_array})
        }
    })    
}

const download = (request, response) => {
    const filename = request.params.filename;
    console.log(filename);
    var doc_path = __dirname +path.join('/dokumens/absensi/'+ filename);
    console.log(doc_path);
    response.download(doc_path);
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

module.exports = 
{
    create,
    read,
    readbyid,
    download,
}