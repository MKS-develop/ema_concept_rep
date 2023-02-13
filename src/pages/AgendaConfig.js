import moment from 'moment'
import 'moment/locale/es-mx';
// import React, {useState, useEffect} from 'react'

moment.locale("es");

class AgendaConfig {
    
    getTimes(desde, hasta, duracion) {

        const time2 = duracion.split(":")
        const hh = parseInt(time2[0])
        const mm = parseInt(time2[1])

        const multply = hh * 60

        const durationInMinutes = multply + mm

        const startTime = desde;
        const startTime2 = startTime.split(":")
        const endTime = hasta;
        const endTime2 = endTime.split(":")
        var list = []
        var list2 = []
        
        var Shour = parseInt(startTime2[0]);
        var Sminute = parseInt(startTime2[1]);
        
        var Ehour = parseInt(endTime2[0]);
        var Eminute = parseInt(endTime2[1]);

        
        do {
            var time = Shour + ":" + (Sminute >= 60 ? 0 : Sminute)
            list.push(time)
            Sminute += durationInMinutes
            console.log(parseInt(Shour + (Sminute.toString() === "0" ? "00" : Sminute)) + " - " + parseInt(Ehour + ( Eminute.toString() === "0" ? "00" : Eminute )))

            while(Sminute >= 60){
                console.log(Sminute >= 60)
                Sminute -= 60
                Shour++
            }
        } while (parseInt(Shour.toString() + (Sminute.toString() === "0" ? "00" : Sminute.toString())) < parseInt(Ehour.toString() + ( Eminute.toString() === "0" ? "00" : Eminute.toString() )))
        list.forEach((time)=> {
            const a = time.split(":")
            if(parseInt(a[1]) < 10){
                let b = "0" + a[1] 
                let c = a[0] + ":" + b
                list2.push(c)
            }else{
                list2.push(time)
            }
        })
        return list2
    }

    getDates() {
        let nbDays = 0
        let list = []
        let currentDay = moment()
        let endDate = moment().add(6, 'months')
        while (moment(currentDay).isBefore(endDate)) {
            currentDay = moment(currentDay).add(1, 'day')
            list.push(currentDay.format("ddd, MMM D YYYY"))
            nbDays++
        }
        console.log(list.length)
        return list
    }

    restHoursFrom(time, startTime, endTime){
        var horaD = startTime.split(":");

        var horaDD = parseInt(horaD[0]);
        var horaMD = parseInt(horaD[1]);
        console.log(time)
        for(let i = 0; i < time.length; i++){
            var hora = time[i].split(":");
            var horaHH = parseInt(hora[0]);
            var horaMH = parseInt(hora[1]);
            if( horaHH === horaDD){
                if(horaMD < horaMH){
                    do{
                        horaMD++;
                    }while(horaMD < horaMH);
                    let descansodd = horaD[0].toString() + ":" + (horaMD <= 9 ? "0" + horaMD.toString() : horaMD.toString() );
                    let dd = time.indexOf(descansodd);
                    console.log(dd)
                    return this.restHoursTo(time, endTime, dd)
                    // return true
                }else if(horaMD === horaMH){
                    let descansodd = horaD[0].toString() + ":" + horaD[1].toString();
                    let dd = time.indexOf(descansodd);
                    console.log(dd)
                    return this.restHoursTo(time, endTime, dd)
                    // return true
                }else if(horaMD > horaMH){
                    do{
                        horaMD--;
                    }while(horaMD > horaMH);
                    let descansodd = horaD[0].toString() + ":" + (horaMD <= 9 ? "0" + horaMD.toString() : horaMD.toString() );
                    let dd = time.indexOf(descansodd);
                    console.log(dd)
                    return this.restHoursTo(time, endTime, dd)
                    // return true
                }
            }else{
                i++;
            }
        
        }
    }
    
    restHoursTo(time, startTime, dd){
        var horaD = startTime.split(":");

        var horaDD = parseInt(horaD[0]);
        var horaMD = parseInt(horaD[1]);

        for(let i = 0; i < time.length; i++){
            var hora = time[i].split(":");
            var horaHH = parseInt(hora[0]);
            var horaMH = parseInt(hora[1]);
            if( horaHH === horaDD){
                if(horaMD < horaMH){
                    do{
                        horaMD++;
                    }while(horaMD < horaMH)
                    let descansodd = horaD[0].toString() + ":" + (horaMD <= 9 ? "0" + horaMD.toString() : horaMD.toString() )
                    let dh = time.indexOf(descansodd)
                    console.log(dh)
                    return this.rest(time, dd, dh)
                }else if(horaMD === horaMH){
                    let descansodd = horaD[0].toString() + ":" + horaD[1].toString()
                    let dh = time.indexOf(descansodd)
                    console.log(dh)
                    return this.rest(time, dd, dh)
                }else if(horaMD > horaMH){
                    do{
                        horaMD--;
                    }while(horaMD > horaMH)
                    let descansodd = horaD[0].toString() + ":" + (horaMD <= 9 ? "0" + horaMD.toString() : horaMD.toString() )
                    let dh = time.indexOf(descansodd)
                    console.log(dh)
                    return this.rest(time, dd, dh)
                }
            }else{
                i++;
            }
        
        }
    }

    rest(time, desde, hasta){
        let n = []
        for(let i = 0; i < time.length; i++){
            if(i >= desde && i < hasta){
                n.push(time[i])
            }else{
                i++
            }
        }
        n.forEach((val)=>{
            var index = time.indexOf(val)
            if (index > -1) {
                time.splice(index, 1)
            }              
        })
        return time
    }

}

export default new AgendaConfig()