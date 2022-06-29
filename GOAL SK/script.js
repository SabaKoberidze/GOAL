"use strict";
const grid = document.querySelector(".grid");
const gridContainer = document.querySelector(".gridContainer");
const betbutton = document.querySelector(".betbutton");
const Radio = document.querySelectorAll("input[name='fieldsize']");
const size = document.querySelector(".size");
const balanceamount = document.querySelector(".balance");
const betamount = document.querySelector(".amount");
const addamount = document.querySelectorAll(".addamount");
const inputcontainer = document.querySelector(".inputcontainer");
const winamount = document.querySelector(".winamount");
const currentcontainer = document.querySelector(".radiocontainer");
const sizecover = document.querySelector(".sizecover");
const betcover = document.querySelector(".betcover");
const mainContainer = document.querySelector(".mainContainer");
const outofmoney = document.querySelector(".lostthemoney");
const typeofgamemode = document.querySelector(".type");
const typecover = document.querySelector(".typecover");
const autolabel = document.querySelectorAll(".autolabel");
const onwin = document.querySelector(".onwinmanual");
const onlose = document.querySelector(".onlosemanual");
const onwinp = document.querySelector(".onwinmanualp");
const onlosep = document.querySelector(".onlosemanualp");
//columncount for bombs
let x = 0;

const values = {
  radiovalue: 1,
  focus: 0,
  roundbet: 0.1,
  multiplier: [1.502, 1.3343, 1.2506],
  smallrez: [1.45],
  mediumrez: [1.72],
  bigrez: [1.21],
  calcincome: [],
  balance: 3000,
  same: [0, 0, false],
  currentfocusvar: 0,
  winamount: 0,
  gamemode: "Manual",
  aq: 0,
  nnn: 0,
  autowin: false,
  explosioncount: 0,
};
function textbar() {
  betamount.addEventListener("blur", () => {
    values.roundbet = Number(betamount.value);
    if (values.roundbet >= 100) {
      values.roundbet = 100;
      betamount.value = (100).toFixed(2);
    }
    if (values.roundbet < 0.1) {
      values.roundbet = 0.1;
      betamount.value = (0.1).toFixed(2);
    }
    if (values.roundbet > 0.1 && values.roundbet < 100) {
      betamount.value = values.roundbet.toFixed(2);
    }
  });
  betamount.addEventListener("input", (i) => {
    const newnum = Number(betamount.value[betamount.value.length - 1]);
    if (!Number.isInteger(newnum)) {
      betamount.value = betamount.value.replace(
        betamount.value[betamount.value.length - 1],
        ""
      );
    }
  });
}
textbar();
function plusminus() {
  inputcontainer.children[0].addEventListener("click", () => {
    if (values.roundbet >= 0.2) {
      values.roundbet = values.roundbet - 0.1;

      let k = values.roundbet.toFixed(2);
      values.roundbet = Number(k);
      betamount.value = k;
      values.same[1] = 1;
      values.same[2] = true;
    }
  });
  inputcontainer.children[2].addEventListener("click", () => {
    if (values.roundbet <= 99.9) {
      values.roundbet = values.roundbet + 0.1;

      let k = values.roundbet.toFixed(2);
      values.roundbet = Number(k);
      betamount.value = k;
      values.same[1] = 1;
    }
  });
}
plusminus();

function addbetamount() {
  addamount.forEach((element, index) => {
    element.addEventListener("click", () => {
      if (
        values.roundbet === 0.1 ||
        values.same[0] != index ||
        values.same[1] === 1
      ) {
        values.roundbet = 0;
        values.same[1] = 0;
      }
      values.same[0] = index;
      if (addamount[index] === addamount[index - 1]) {
      }
      switch (index) {
        case 0:
          values.roundbet += 1;
          break;
        case 1:
          values.roundbet += 3;
          break;
        case 2:
          values.roundbet += 5;
          break;
        case 3:
          values.roundbet += 10;
          break;
        default:
          break;
      }
      if (values.roundbet > 100) {
        values.roundbet = 100;
      }
      betamount.value = values.roundbet.toFixed(2);
    });
  });
}
addbetamount();

function game() {
  function typeofgame() {
    for (let z = 0; z < 2; z++) {
      typeofgamemode.children[z].addEventListener("change", () => {
        for (let k = 0; k < 2; k++) {
          typeofgamemode.children[z].classList.add("currentmode");
          typeofgamemode.children[k].classList.remove("notcurrentmode");
          if (typeofgamemode.children[0].classList.contains("currentmode")) {
            values.gamemode = "Manual";
            onwinp.classList.remove("onwinp");
            onlosep.classList.remove("onlosep");
            onwin.classList.remove("onwin");
            onlose.classList.remove("onlose");
            betbutton.classList.remove("disabled");
            betbutton.classList.remove("awaiting");
            while (grid.firstChild) {
              grid.removeChild(grid.firstChild);
            }
            values.focus = 0;
            values.currentfocusvar = 0;
            makeGrid(Number(values.radiovalue));
            for (let c = 0; c < grid.children.length; c++) {
              grid.children[c].children[
                grid.children[0].children.length - 1
              ].classList.remove("invisible");
            }
          } else {
            onwin.classList.add("onwin");
            onlose.classList.add("onlose");
            onwinp.classList.add("onwinp");
            onlosep.classList.add("onlosep");
            values.gamemode = "Automatic";
            betbutton.classList.add("disabled");
            focusarea();
            for (let c = 0; c < grid.children.length; c++) {
              grid.children[c].children[
                grid.children[0].children.length - 1
              ].classList.add("invisible");
            }
          }

          if (k != z) {
            typeofgamemode.children[k].classList.remove("currentmode");
            typeofgamemode.children[k].classList.add("notcurrentmode");
          }
        }
      });
    }
  }

  //size of the board
  function radio() {
    let radiovalue;
    for (let r = 0; r < Radio.length; r++) {
      Radio[r].addEventListener("click", function radioevent() {
        if (!size.classList.contains("disabled")) {
          for (const radioButton of Radio) {
            if (!radioButton.classList.contains("current")) {
              if (radioButton.checked) {
                radiovalue = radioButton.value;
                radioButton.classList.add("current");
                radioButton.parentElement.parentElement.classList.add(
                  "currentcontainer"
                );
                currentradio(radioButton);
                while (grid.firstChild) {
                  grid.removeChild(grid.firstChild);
                }
                makeGrid(Number(radiovalue));
                values.radiovalue = radiovalue;
                values.focus = 0;
                values.currentfocusvar = 0;
                arrayofbombs = [];
                arrayofselection = [];
                if (values.gamemode === "Automatic") {
                  focusarea();
                }
              }
            }
          }
        }
      });
    }
  }
  //current board
  function currentradio(radioButton) {
    for (let l = 0; l < Radio.length; l++) {
      if (Radio[l] != radioButton) {
        Radio[l].classList.remove("current");
        Radio[l].parentElement.parentElement.classList.remove(
          "currentcontainer"
        );
      }
    }
  }
  //grid function
  function makeGrid(x) {
    let i;
    if (x === 0) {
      for (i = 0; i < 4; i++) {
        gridComponent(1);
      }
    }
    if (x === 1) {
      for (i = 0; i < 7; i++) {
        gridComponent(2);
      }
    }
    if (x === 2) {
      for (i = 0; i < 10; i++) {
        gridComponent(3);
      }
    }
    gamecell(x);
    values.smallrez[0] = 1.45;
    values.mediumrez[0] = 1.29;
    values.bigrez[0] = 1.21;
    values.calcincome = [];
    multiplierindexcalc();
  }
  //columns
  function gridComponent(type) {
    let j;
    grid.setAttribute("class", "grid");
    const cell = document.createElement("div");
    switch (type) {
      case 1:
        j = "small";
        break;
      case 2:
        j = "medium";
        break;
      case 3:
        j = "big";
        break;
    }
    grid.classList.add(j);
    cell.classList.add("column");
    grid.appendChild(cell);
  }
  //cells
  function gamecell(size) {
    const p = document.querySelectorAll(".column");
    let rows = [3, 4, 5];
    for (let q = 0; q < p.length; q++) {
      for (let w = 0; w < rows[size]; w++) {
        const innercell = document.createElement("div");
        innercell.classList.add("innercell");
        p[q].appendChild(innercell);
        if (w == rows[size] - 1) {
          const multiplier = document.createElement("div");
          multiplier.classList.add("multiplier");
          if (values.gamemode == "Automatic") {
            multiplier.classList.add("invisible");
          }
          p[q].appendChild(multiplier);
          if (rows[size] === 3) {
            multiplier.classList.add("small-multiplier");
          }
          if (rows[size] === 4) {
            multiplier.classList.add("medium-multiplier");
          }
          if (rows[size] === 5) {
            multiplier.classList.add("big-multiplier");
          }
        }
      }
    }
  }

  //random number
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  //playzone
  function focusarea() {
    const x = document.querySelectorAll(".column");
    x[values.focus].classList.add("active");
    if (values.focus >= 1) {
      x[values.focus - 1].classList.remove("active");
      x[values.focus - 1].classList.add("used");
    }
    pick(x[values.focus]);
    if (values.focus < x.length - 1) {
      if (
        values.focus === 1 &&
        !grid.classList.contains("lost") &&
        values.gamemode != "Automatic"
      ) {
        betbutton.classList.add("cashout");
      }
      values.focus++;
    }
    if (betbutton.classList.contains("cashout")) {
      betbutton.innerHTML = `CASHOUT 
          ${(
            Math.trunc(
              100 *
                (Number(
                  x[values.currentfocusvar].lastChild.innerHTML.slice(1)
                ) *
                  values.roundbet)
            ) / 100
          ).toFixed(2)} $
        `;
    }
  }
  //playzone movement
  function pick(area) {
    if (values.gamemode === "Manual") {
      if (!grid.classList.contains("lost")) {
        currentfocus();
        const innercell = area.children;
        for (let index = 0; index < innercell.length - 1; index++) {
          innercell[index].addEventListener("click", () => {
            if (innercell[index].parentElement.classList.contains("active")) {
              if (area != grid.lastChild) {
                const passed = document.createElement("div");
                passed.classList.add("passed");
                area.children[index].appendChild(passed);
                const Bomblocation = document.createElement("div");
                Bomblocation.classList.add("bombinserted");

                area.children[arrayofbombs[x][1]].appendChild(Bomblocation);
                const check = checker(x, index);

                if (check == "finished") {
                  betbutton.innerHTML = "BET";
                  index = 0;
                  x = 0;
                } else {
                  x++;
                }
                focusarea();
              } else {
                const passed = document.createElement("div");
                passed.classList.add("passed");
                area.children[index].appendChild(passed);
                const Bomblocation = document.createElement("div");
                Bomblocation.classList.add("bombinserted");
                area.children[arrayofbombs[x][1]].appendChild(Bomblocation);
                const check = checker(x, index);
                if (check == "finished") {
                  betbutton.innerHTML = "BET";
                  index = 0;
                  x = 0;
                  return 0;
                }
                x = 0;
                index = 0;
                values.currentfocusvar = 0;
                betbutton.innerHTML = "BET";
                area.classList.remove("active");
                grid.lastChild.classList.add("used");

                finish();
              }
            }
          });
        }
      }
    } else {
      for (let m = 0; m < area.children.length - 1; m++) {
        if (!grid.classList.contains("lost")) {
          area.children[m].addEventListener("click", () => {
            if (area.children[m].parentElement.classList.contains("active")) {
              const flag = document.createElement("div");
              flag.classList.add("flag");
              if (area != grid.lastChild) {
                if (area === grid.children[0]) {
                  betbutton.classList.add("awaiting");
                }
                focusarea();
                arrayofselection.push([values.currentfocusvar, m]);
                area.children[m].appendChild(flag);

                values.currentfocusvar++;
              } else {
                area.children[m].appendChild(flag);
                arrayofselection.push([values.currentfocusvar, m]);
                values.currentfocusvar = 0;
                area.classList.remove("active");
                grid.lastChild.classList.add("used");
                grid.lastChild.classList.add("filled");

                return 0;
              }
            }
          });
        }
      }
    }
    function checker(x, y) {
      arrayofselection.push([x, y]);
      if (arrayofbombs[x][1] === y) {
        lose(x, y);
        return "finished";
      }
    }
    function finish() {
      values.balance =
        values.balance +
        Math.trunc(
          100 *
            values.roundbet *
            values.calcincome[values.calcincome.length - 1]
        ) /
          100;

      balanceamount.innerHTML = String(values.balance.toFixed(2));
      betbutton.classList.remove("disabled");
      size.classList.remove("disabled");
      betbutton.classList.remove("cashout");
      sizecover.classList.remove("coveractivesize");
      typecover.classList.remove("typecoverhidden");
      betcover.classList.remove("coveractiveinput");
      values.winamount =
        Math.trunc(
          100 *
            values.roundbet *
            values.calcincome[values.calcincome.length - 1]
        ) / 100;
      winamount.innerHTML = `+${values.winamount.toFixed(2)} $`;
      winamount.classList.add("visible");
      window.setTimeout(() => {
        winamount.classList.remove("visible");
        winamount.innerHTML = "";
      }, 600);
      values.winamount = 0;
    }
  }
  function automode() {
    let interval = setInterval(function () {
      function stop() {
        clearInterval(interval);
        clearTimeout(timout1);
        clearTimeout(timout2);
        values.nnn = 0;
        reset(0);
        betbutton.classList.remove("awaiting");
        betbutton.classList.remove("stop");
        betbutton.innerHTML = "BET";
        betbutton.removeEventListener("click", stop);
        betbutton.classList.remove("disabled");
        size.classList.remove("disabled");
        sizecover.classList.remove("coveractivesize");
        typecover.classList.remove("typecoverhidden");
        betcover.classList.remove("coveractiveinput");
      }
      if (betbutton.classList.contains("stop")) {
        betbutton.addEventListener("click", stop);
      }
      bombplanting();
      values.balance = values.balance - values.roundbet;

      balanceamount.innerHTML = values.balance.toFixed(2);

      for (let y = 0; y < grid.children.length; y++) {
        if (grid.children[y].classList.contains("active")) {
          if (values.nnn === 0) {
            values.aq = y;
            values.nnn++;
            grid.children[y].classList.remove("active");
          }
        }
      }
      if (grid.lastChild.classList.contains("filled")) {
        values.aq = grid.children.length;
      }
      // if (aq == undefined) {
      //   aq = grid.children.length;
      //

      for (let v = 0; v < values.aq; v++) {
        const passed = document.createElement("div");
        const exploded = document.createElement("div");
        const bombs = document.createElement("div");
        bombs.classList.add("bombinserted");
        exploded.classList.add("explosion");
        passed.classList.add("passed");
        grid.children[v].children[arrayofselection[v][1]].innerHTML = "";
        let where = 100;
        if (arrayofbombs[v][1] === arrayofselection[v][1]) {
          grid.children[v].children[arrayofselection[v][1]].appendChild(
            exploded
          );
          values.autowin = false;
          where = v;
          values.explosioncount++;
        } else {
          values.autowin = true;
        }
        if (v != where) {
          grid.children[v].children[arrayofselection[v][1]].appendChild(passed);
          grid.children[v].children[arrayofbombs[v][1]].appendChild(bombs);
        }
        if (values.explosioncount > 0) {
          values.autowin = false;
        } else {
          values.autowin = true;
        }
        where = 100;
      }
      if (values.autowin === true) {
        if (!grid.lastChild.classList.contains("filled")) {
          let multi = Number(
            grid.children[values.aq - 1].lastChild.innerHTML.slice(1)
          );

          values.balance = values.balance + values.roundbet * multi;
          balanceamount.innerHTML = (
            Math.trunc(100 * values.balance) / 100
          ).toFixed(2);
          values.balance = Math.trunc(100 * values.balance) / 100;
        } else {
          values.balance =
            values.balance +
            Number(grid.lastChild.lastChild.innerHTML.slice(1)) *
              values.roundbet;
          balanceamount.innerHTML = values.balance;
        }
      }
      arrayofbombs = [];
      let timout1 = setTimeout(function () {
        values.explosioncount = 0;
        while (grid.firstChild) {
          grid.removeChild(grid.firstChild);
        }
        makeGrid(Number(values.radiovalue));
      }, 1000);
      let timout2 = setTimeout(function () {
        for (let v = 0; v < values.aq; v++) {
          const flag = document.createElement("div");
          flag.classList.add("flag");
          grid.children[v].classList.add("used");
          grid.children[v].children[arrayofselection[v][1]].appendChild(flag);
        }
      }, 1000);
    }, 3000);
  }
  //default grid
  makeGrid(1);

  //geme start
  betbutton.addEventListener("click", () => {
    if (values.gamemode == "Automatic") {
      if (
        betbutton.classList.contains("awaiting") &&
        !betbutton.classList.contains("stop")
      ) {
        automode(arrayofselection);
        betbutton.classList.add("stop");
        size.classList.add("disabled");
        sizecover.classList.add("coveractivesize");
        typecover.classList.add("typecoverhidden");
        betcover.classList.add("coveractiveinput");
        betbutton.innerHTML = "STOP";
        outofmoney.classList.add("notallowed");
        // reset(0);
      }
      return 0;
    }

    if (!betbutton.classList.contains("disabled")) {
      reset(0);
    }
    if (betbutton.classList.contains("cashout")) {
      reset(1);
      betbutton.classList.remove("cashout");
      betbutton.innerHTML = "BET";
    }
  });
  //restarting the game
  function reset(resetindex) {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    arrayofbombs = [];
    arrayofselection = [];
    makeGrid(Number(values.radiovalue));
    if (values.gamemode != "Automatic") {
      bombplanting();
    }
    values.focus = 0;
    if (resetindex === 0) {
      betbutton.classList.add("disabled");
      size.classList.add("disabled");
      sizecover.classList.add("coveractivesize");
      typecover.classList.add("typecoverhidden");
      betcover.classList.add("coveractiveinput");
      focusarea();
      if (values.balance - values.roundbet < 0) {
        alert("Out of money");

        betbutton.classList.remove("disabled");
        typecover.classList.remove("typecoverhidden");
        sizecover.classList.remove("coveractivesize");
        betcover.classList.remove("coveractiveinput");
        size.classList.remove("disabled");
        outofmoney.classList.add("notallowed");
      } else {
        values.balance -= values.roundbet;
        outofmoney.classList.remove("notallowed");
      }
    } else {
      betbutton.classList.remove("disabled");
      size.classList.remove("disabled");
      sizecover.classList.remove("coveractivesize");
      typecover.classList.remove("typecoverhidden");
      betcover.classList.remove("coveractiveinput");
      let thisbalance = Number(values.balance);
      thisbalance +=
        Math.trunc(
          100 *
            (values.roundbet *
              grid.children[values.currentfocusvar].lastChild.innerHTML.slice(
                1
              ))
        ) / 100;
      values.winamount =
        Math.trunc(
          100 *
            (values.roundbet *
              grid.children[values.currentfocusvar].lastChild.innerHTML.slice(
                1
              ))
        ) / 100;
      winamount.innerHTML = `+${values.winamount.toFixed(2)} $`;
      winamount.classList.add("visible");
      window.setTimeout(() => {
        winamount.classList.remove("visible");
        winamount.innerHTML = "";
      }, 600);
      values.winamount = 0;

      values.balance = thisbalance;
      x = 0;
    }
    values.currentfocusvar = 0;
    balanceamount.innerHTML = String(values.balance.toFixed(2));
    multiplier();
  }
  function currentfocus() {
    for (let i = 0; i < grid.children.length; i++) {
      if (grid.children[i].classList.contains("active")) {
        values.currentfocusvar = i - 1;
      }
    }
  }
  //bomb locations
  let arrayofbombs = [];
  let arrayofselection = [];
  //location of bombs
  function bombplanting() {
    const height = grid.children[0].children.length - 1;

    for (let i = 0; i < grid.children.length; i++) {
      const rndInt = randomIntFromInterval(0, height - 1);
      arrayofbombs.push([i, rndInt]);
    }
  }

  //clicked on the bomb
  function lose(x, y) {
    grid.classList.add("lost");

    betbutton.classList.remove("disabled", "cashout");
    sizecover.classList.remove("coveractivesize");
    typecover.classList.remove("typecoverhidden");
    betcover.classList.remove("coveractiveinput");
    const EXPLOSION = document.createElement("div");
    EXPLOSION.classList.add("explosion");
    grid.children[x].children[y].innerHTML = "";
    grid.children[x].children[y].appendChild(EXPLOSION);
    for (let i = 0; i < grid.children.length; i++) {
      if (i != x) {
        const Bomblocation = document.createElement("div");
        Bomblocation.classList.add("bombinserted");
        grid.children[arrayofbombs[i][0]].children[
          arrayofbombs[i][1]
        ].innerHTML = "";
        grid.children[arrayofbombs[i][0]].children[
          arrayofbombs[i][1]
        ].appendChild(Bomblocation);
        // }
      }
    }
    arrayofselection = [];
    size.classList.remove("disabled");
  }

  //default radio
  radio();
  typeofgame();
  //multiplier button
  
  function multiplier() {
    const length = grid.children.length;
    let y;
    if (length === 4) {
      y = 2;
    }
    if (length === 7) {
      y = 3;
    }
    if (length === 10) {
      y = 4;
    }
    const elem = document.createElement("div");
    for (let i = 0; i < length; i++) {
      elem.after(grid.children[i].children[y]);
    }
  }
  //income multiplier
  function multiplierindexcalc() {
    const multiplierindex = document.querySelectorAll(".multiplier");
    for (let o = 0; o < multiplierindex.length; o++) {
      if (multiplierindex.length === 4) {
        if (o === 0) {
          multiplierindex[o].innerHTML = `x${values.smallrez[0]}`;
          values.calcincome.push(values.smallrez[0].slice);
        } else {
          values.smallrez[0] =
            Math.round(100 * (values.smallrez[0] * values.multiplier[0])) / 100;
          multiplierindex[o].innerHTML = `x${values.smallrez[0]}`;

          values.calcincome.push(values.smallrez[0]);
        }
      }
      if (multiplierindex.length === 7) {
        if (o === 0) {
          multiplierindex[o].innerHTML = `x${values.mediumrez[0]}`;
          values.calcincome.push(values.mediumrez[0]);
        } else {
          values.mediumrez[0] =
            Math.round(100 * (values.mediumrez[0] * values.multiplier[1])) /
            100;
          multiplierindex[o].innerHTML = `x${values.mediumrez[0]}`;
          values.calcincome.push(values.mediumrez[0]);
        }
      }
      if (multiplierindex.length === 10) {
        if (o === 0) {
          multiplierindex[o].innerHTML = `x${values.bigrez[0]}`;
          values.calcincome.push(values.bigrez[0]);
        } else {
          values.bigrez[0] =
            Math.round(100 * (values.bigrez[0] * values.multiplier[2])) / 100;
          multiplierindex[o].innerHTML = `x${values.bigrez[0]}`;
          values.calcincome.push(values.bigrez[0]);
        }
      }
    }
  }
  function autolabelfunc() {
    for (let i = 0; i < 3; i++) {
      autolabel[i].addEventListener("click", () => {
        autolabel[i].classList.add("currentauto");
        for (let z = 0; z < 3; z++) {
          if (z != i) {
            autolabel[z].classList.remove("currentauto");
          }
        }
      });
    }
    for (let i = 3; i < 6; i++) {
      autolabel[i].addEventListener("click", () => {
        autolabel[i].classList.add("currentauto");
        for (let z = 3; z < 6; z++) {
          if (z != i) {
            autolabel[z].classList.remove("currentauto");
          }
        }
      });
    }
  }
  autolabelfunc();
}
game();
