const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcryptjs");

const login = (request, response) => {
    const { username,password } 
    = request.body

    var res_array = [];
    var items = [];

    pool.query('SELECT count(*) as total from tbmuser WHERE username =$1',[username],(error,results) => {
        if(results) {
            // items.push({rows:results.rows})
            // res.push(items)
            // response.status(200).json( {success:true,data:res})
            pool.query('SELECT password,pegawaiid from tbmuser WHERE username =$1',[username],(error1,results1) => {
                  
                    const res = bcrypt.compareSync(password,results1.rows[0].password)
                    var pegawaiid = results1.rows[0].pegawaiid;
                    //console.log(res)

                     if(res==true) {
                        // response.status(200).json( {success:true,data: 'user ditemukan'})
                        pool.query('SELECT pegawaiid,nip,namapegawai,urlfoto,alamatsekarang,nohp,fotomedicalcheckup FROM tbmpegawai WHERE pegawaiid =$1',[pegawaiid],(error2,results2) => {
                            items.push({rows:results2.rows})
                            res_array.push(items)
                            response.status(200).json( {success:true,data:res_array})
                        })
                     }
                     else
                     {
                         response.status(400).json({success:false,data: "password tidak sama" })   
                     }
                // })
            })
        } else {
            //console.log('Your password not mached.');
            response.status(400).json({success:false,data: "user tidak ada" });
        }
    })
}



module.exports = {
    login,
    }