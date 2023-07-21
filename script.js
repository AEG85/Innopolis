function createNode(element) {
    return document.createElement(element)
}
function append(parent, el) {
    return parent.appendChild(el)
}
const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
const CITY_NAME = 'Омск'
const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${CITY_NAME}&format=json`
fetch(API_URL_GEO_DATA).then(
    (resp) => resp.json()).then(
        function (data) {
            let position = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
            let coordinates = []
            if (position) {
                coordinates = position.split(' ')
                if (coordinates) {
                    const apiOpenMeteo = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=pm10,pm2_5`
                    return fetch(apiOpenMeteo).then(
                        (resp) => resp.json()).then(
                            function (data) {
                                let polutionInfo = data.hourly;
                                let table = createNode('table')
                                let trPM2_5 = createNode('tr')
                                let tdPM2_5 = createNode('td')
                                tdPM2_5.innerHTML = 'pm2_5';
                                let trPM10 = createNode('tr')
                                let tdPM10 = createNode('td')
                                tdPM10.innerHTML = 'pm10';
                                let trTime = createNode('tr')
                                let tdTime = createNode('td')
                                tdTime.innerHTML = 'Время';
                                table.style.border = tdPM2_5.style.border = tdPM10.style.border = tdTime.style.border = '1px solid black'
                                append(table, trTime);
                                append(table, trPM2_5);
                                append(table, trPM10);
                                append(trPM2_5, tdPM2_5);
                                append(trPM10, tdPM10);
                                append(trTime, tdTime);

                                polutionInfo.pm2_5.map(function (info) {
                                    let td = createNode('td');
                                    td.style.border = '1px solid black'
                                    td.innerHTML = info;
                                    append(trPM2_5, td);
                                })
                                polutionInfo.pm10.map(function (info) {
                                    let td = createNode('td');
                                    td.innerHTML = info;
                                    td.style.border = '1px solid black'
                                    append(trPM10, td);
                                })
                                polutionInfo.time.map(function (info) {
                                    let dateTime = info.split('T')
                                    let td = createNode('td');
                                    td.style.border = '1px solid black'
                                    td.style.minWidth = '80px'
                                    td.innerHTML = dateTime[0] + ' ' + dateTime[1];
                                    append(trTime, td);
                                })
                                let div = document.getElementById('air-pollution')
                                append(div, table)
                            })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            }
        })
    .catch(function (error) {
        console.log(error);
    })

