//Importaciones
const fs = require('fs');
const http = require('http');
const axios = require('axios');

async function getDatafromProovedoresServer() {
    const resp = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json');
    // console.log(resp.data);
    return resp.data;
}

async function getDatafromClientesServer() {
    const resp = await axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json');
    // console.log(resp.data);
    return resp.data;
}

// Crea una nueva instancia del servidor
http
    .createServer(async function (req, res) {
        // Encabezado de la respuesta por defecto del servidor
        if (req.url === '/api/proveedores') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const arrayProveedoresJson = await getDatafromProovedoresServer();
            fs.readFile('index-table.html', 'utf8', (err, data) => {
                const topSection = data.substring(0, data.indexOf('</tbody>'))
                const downSection = data.substring(data.indexOf('</tbody>'))
                var fila = "";
                arrayProveedoresJson.forEach(element => {
                    fila += `<tr><td>${element.idproveedor}</td><td>${element.nombrecompania}</td><td>${element.nombrecontacto}</td></tr>`;
                });
                return res.end(topSection + fila + downSection);
            });
        } else if (req.url === '/api/clientes') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            const arrayClientesJson = await getDatafromClientesServer();
            fs.readFile('index-table.html', 'utf8', (err, data) => {
                const topSection = data.substring(0, data.indexOf('</tbody>'))
                const downSection = data.substring(data.indexOf('</tbody>'))
                var fila = "";
                arrayClientesJson.forEach(element => {
                    fila += `<tr><td>${element.idCliente}</td><td>${element.NombreCompania}</td><td>${element.NombreContacto}</td></tr>`;
                });
                return res.end(topSection + fila + downSection);
            });
        } else {
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("Error en la peticion del Request");
        }
    })
    .listen(8081);