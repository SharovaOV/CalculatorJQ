$(function () {
    var display_element = $("#display"); // Элемент дисплей калькулятора
    var action; // Вид действия
    // Флаги
    var isPoint = false, isNewValue = false, valueSet1 = false, CE_press=false;
     
    //Переменные для вычисления
    var value1 = 0, value2 = 0, memoryVal = 0;

    // Для анимации кнопок
    //-----------------------------------------------
    $(".calc_button").addClass("up");
    $(".calc_button").mousedown(function () {
        
        $(this).toggleClass("up down");

    });
    $(".calc_button").mouseup(function () {
        if ($(this).hasClass("down"))
            $(this).toggleClass("up down");

    });
    $(".calc_button").mouseout(function () {
        if ($(this).hasClass("down"))
            $(this).mouseup();
    });
    //---------------------------------------------
    //Ввод чисел
    //----------------------------------------------
    $(".number").on("click", function () {
        if ((display_element.text() == "0") || (isNewValue))
        {
            display_element.text($(this).text());
            isNewValue = false;
        }
        else
            display_element.append($(this).text());
    });
    $("#point").on("click", function () {
        if (isNewValue) {
            display_element.text("0");
            isNewValue = false;
        }
        if (!isPoint) {        
            display_element.append(".");
            isPoint = true;
        }
    
    });
    $("#plus_minus").on("click", function () {

        var num = +display_element.text();
        if (num == 0)
            return;
        if (num<0)
            display_element.text(display_element.text().substr(1));
        else
             display_element.text("-"+display_element.text());
    });
    $("#backspace").on("click", function () {
        if (display_element.text() == "0")
            return;
        if ((display_element.text().length == 1)|| (isNewValue)) {
            display_element.text(0);
            return;
        }
        display_element.text(display_element.text().slice(0,-1));
    });

    //----------------------------------------------
    //Работа с памятью
    //---------------------------------------------

    //Добавить в память
    $("#m_plus").on("click", function () {
        if (action != "")
            $("#result").click();
        memoryVal += +display_element.text();

    });
    //Вычесть из памяти
    $("#m_minus").on("click", function () {
        if (action != "")
            $("#result").click();
        memoryVal -= +display_element.text();
    });
    //Вставить из памяти
    $("#MR").on("click", function () {
        display_element.text(memoryVal);
        isNewValue = true;
    });
    //Сброс памяти
    $("#MC").on("click", function () {
        memoryVal = 0;
    });

    //-----------------------------------------------
    //Действия с данными
    //-----------------------------------------------

    //Запомнить действие
    $(".action").on("click", function () {
        action = $(this).text();
        if (!valueSet1) {
            valueSet1 = true;
            value1 = +display_element.text();
        }
        else
        {
            $("#result").click();
            value1 = +display_element.text();
        }
        console.log(action);
        isNewValue=true;
    });
    //Обнуление параметров
    function reset() {
        value1 = 0;
        valueSet1 = false;
        value2 = 0;
        isNewValue = true;
        isPoint = false;
        action = "";
    }
    function result() {
        console.log("result "+action);
        let res;
        switch (action) {
            case "+":
                res=value1 + value2;
                break;
            case "-":
                res=value1 - value2;
                break;
            case "÷":
                if(value2)
                res=value1 / value2;
                break;
            case "×":
                res=value1 * value2;
                break;
            case "^":
                res = Math.pow(value1, value2);
                break;
            default:
                return;
        }
        display_element.text(res);
        reset();
    }
    //Вычисление наценок
    $("#MU").on("click", function () {
        if (action == "")
            return;
        value2 = +display_element.text();
        let res;
        switch (action) {
            case "+":
                res=100*(value1/value2+1);
                break;
            case "-":
                res=100*(value1/value2-1);
                break;
            case "÷":
                res = value1 / (1 - value2/100);
                break;
            case "×":
                res = value1 * (1 + value2/100);
                break;
            default:
                return;
        }
        display_element.text(res);
        reset();

    });
    //Вычисление результатов простых математических действий
    $("#result").on("click", function () {
        console.log("click "+action);
        if(action == "")
        return;
        value2 = + display_element.text();
        result();
    });
    //Вычисление результатов математических действий с процентами
    $("#procents").on("click", function () {
        if ((action == "") || (action=="^"))
            return;
        value2 = +display_element.text();
        value2 *= value1 * 0.01;
        result();
    });
    //Извлечение квадратного корня
    $("#sqrt").on("click", function () {
        
        let val = +display_element.text();
        if (val < 0)
        {
            alert("Ирациональное число!");
            return;
        }
        display_element.text(Math.sqrt(val));
        isNewValue = true;
    });
    //Число в -1 степени
    $("#pow_minus_one").on("click", function () {
        let val = +display_element.text();
        display_element.text(1 / val);
        isNewValue = true;
    });
    //Сброс оследнего числа или всех данных
    $("#CE_C").on("click", function () {
        
        if (!CE_press) {
            CE_press = true;
            display_element.text("0");
            isNewValue = true;
            console.log("CE");
            $(".calc_button").not("#CE_C").on("click", CE_Reset);
        }
        else {
            reset();
            memoryVal = 0;
            taxVal = 0;
            display_element.text("0");
            CE_Reset();
            console.log("C");
        }
        console.log(CE_press);
    });
    function CE_Reset()
    {
        CE_press = false;
        $(".calc_button").not("#CE_C").off("click", CE_Reset);
        console.log("CE_Reset");
    }
    
    //------------------------------------------------


});