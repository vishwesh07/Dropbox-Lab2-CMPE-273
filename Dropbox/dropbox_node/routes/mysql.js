var mysql = require('mysql');

// -------------------------------------------- With Connection Pooling ------------------------------------------------
function getConnection(){
    var connection = mysql.createPool({
        connecitonLimit : 1000,
        queueLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '#VishwesH@07#',
        database : 'dropbox',
        port	 : 3306
    });
    return connection;
}

function dbOperation(callback,sqlQuery){

    console.log("\nSQL Query : "+sqlQuery);

    var connection=getConnection();

    connection.getConnection(function(err, connection) {
        connection.query(sqlQuery, function (err, rows, fields) {
            if (err) {
                console.log("\n ERROR: " + err.message);
            }
            else {
                console.log("\n DB Results : " + rows.length);
                callback(err, rows);
            }
            console.log("\n Connection closed.");
        });
        connection.release();
    });
}

    // -------------------------------------------- Without Connection Pooling ---------------------------------------------
    // function getConnection(){
    //     var connection = mysql.createConnection({
    //         host     : 'localhost',
    //         user     : 'root',
    //         password : '#VishwesH@07#',
    //         database : 'dropbox',
    //         port	 : 3306
    //     });
    //     return connection;
    // }
    //
    // function dbOperation(callback,sqlQuery){
    //
    //     console.log("\nSQL Query : "+sqlQuery);
    //
    //     var connection=getConnection();
    //
    //     connection.query(sqlQuery, function(err, rows, fields) {
    //         if(err){
    //             console.log("\n ERROR: " + err.message);
    //         }
    //         else
    //         {
    //             // return err or result
    //             console.log("\n DB Results : "+rows.length);
    //             callback(err, rows);
    //         }
    //     });
    //     console.log("\n Connection closed.");
    //     connection.end();
    // }


exports.dbOperation = dbOperation;