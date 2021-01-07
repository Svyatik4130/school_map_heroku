import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { VectorMap } from '@south-paw/react-vector-maps';
import world from '../../world.json';
import descriptions from '../../description.json';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
const images = importAll(require.context('./../../images', false, /\.(png|jpe?g|svg)$/));

function Map() {
    const [isDrag, setisDrag] = useState(false)

    // let recentPressedCountryID = [];
    const [recentPressedCountryID, setrecentPressedCountryID] = useState([])

    const onClick = ({ target }) => {
        if (!isDrag) {
            // cleaning all timeouts and intervals
            for (var i = setTimeout(function () { }, 0); i > 0; i--) {
                window.clearInterval(i)
                if (window.cancelAnimationFrame) window.cancelAnimationFrame(i)
            }

            // DEBUGGING
            // const newarr = world.layers.filter(country => !descriptions.find(desc => desc.name == country.name))
            // console.log(newarr)

            // const newImgArr = world.layers.filter(country => !images[`${country.name.replace(/\s/g, '')}.png`])
            // newImgArr.sort((a, b) => a.name - b.name)
            // console.log(newImgArr)
            //

            // just name which === name in descript
            const name = target.attributes.name.value;
            // console.log(name);
            // console.log("1",name.trim());

            // filling with blue only active elem
            if (recentPressedCountryID.length > 0) {
                document.getElementById(recentPressedCountryID[recentPressedCountryID.length - 1]).style.fill = ''
            }
            target.style.fill = '#94a080'
            recentPressedCountryID.push(target.attributes.id.value)


            // finding this country in JSON
            var foundedArray = descriptions.find(country => country.name === name);

            // resize div
            let wholeinfo = document.getElementById("fullInfo");
            wholeinfo.style.height = `800px`;

            let nameWithoutSpaces = name.replace(/\s/g, '');
            console.log(nameWithoutSpaces)

            // checking
            if (!foundedArray) {
                return (console.log('error'));
            }

            // let nameWithoutSpaces = name.replace(/\s/g, '');
            // console.log(nameWithoutSpaces)

            // getting date for this country
            var timeDisplay = document.getElementById("time");
            var timeInHtml = function () {
                const currDate = new Date();
                let gmtHours = currDate.getUTCHours();
                let gmtMinutes = currDate.getUTCMinutes();
                let gmtSeconds = currDate.getUTCSeconds();
                let localHourGMT = foundedArray.GMT
                if (localHourGMT.split('').includes(':')) {
                    let hourAndMinutes = localHourGMT.split(':');
                    localHourGMT = Number(hourAndMinutes[0]);
                    gmtMinutes = gmtMinutes + Number(hourAndMinutes[1]);
                }
                if (gmtMinutes >= 60) {
                    gmtHours++;
                    gmtMinutes = gmtMinutes - 60;
                }
                if (gmtMinutes < 10) {
                    gmtMinutes = "0" + gmtMinutes;
                } else if (gmtMinutes === 0) {
                    gmtMinutes = "0" + gmtMinutes;
                }
                if (gmtSeconds < 10) {
                    gmtSeconds = "0" + gmtSeconds;
                } else if (gmtSeconds === 0) {
                    gmtSeconds = "0" + gmtSeconds;
                }

                let finalHours = eval(gmtHours + localHourGMT);
                if (finalHours >= 24) {
                    finalHours = finalHours - 24;
                    if (finalHours < 10) {
                        finalHours = "0" + finalHours;
                    }
                }

                var timeInThisCountry = `${finalHours}:${gmtMinutes}:${gmtSeconds}`
                timeDisplay.innerHTML = timeInThisCountry;
            }
            timeInHtml();
            setInterval(timeInHtml, 1000);

            // displaying it
            let nameInput = document.getElementById("titleOfInfo");
            let descInput = document.getElementById("description");

            nameInput.innerHTML = name;
            descInput.innerHTML = foundedArray.description;

            // setting image
            let flagImage = document.getElementById("flagImage")
            flagImage.attributes.src.value = images[`${nameWithoutSpaces}.png`]
            flagImage.style.border = '2px solid #bac8a0'
            // console.log(isDrag)
        }
    }


    function dragEnd() {
        setTimeout(() => {
            setisDrag(false)

        }, 200);
    }
    function dragStart() {
        setTimeout(() => {
            setisDrag(true)
        }, 200);
    }

    return (
        <div className="info-map">
            <TransformWrapper
                defaultPositionX={200}
                defaultPositionY={100}
                options={{ maxScale: 40 }}
                onPanningStart={() => dragStart()}
                onPanningStop={() => dragEnd()}
                doubleClick={{ disabled: true }}>
                <TransformComponent>
                    <VectorMap {...world} layerProps={{ onClick }} style={{ width: "100%" }} />
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}

export default Map;
