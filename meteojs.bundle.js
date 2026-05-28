var meteoJS = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to2, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to2, key) && key !== except)
          __defProp(to2, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to2;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // meteojs-entry.js
  var meteojs_entry_exports = {};
  __export(meteojs_entry_exports, {
    Sounding: () => Sounding_default,
    ThermodynamicDiagram: () => ThermodynamicDiagram_default
  });

  // node_modules/meteojs/calc.js
  function altitudeISAByPres(p) {
    if (p === void 0 || isNaN(p))
      return void 0;
    return 44330.769 * (1 - Math.pow(p / 1013.25, 0.19029496));
  }
  function potentialTempByTempAndPres(temp, pres) {
    if (temp === void 0 || isNaN(temp) || pres === void 0 || isNaN(pres))
      return void 0;
    return temp * Math.pow(1e3 / pres, 0.286);
  }
  function tempByPotentialTempAndPres(potentialTemp, pres) {
    if (potentialTemp === void 0 || isNaN(potentialTemp) || pres === void 0 || isNaN(pres))
      return void 0;
    return potentialTemp * Math.pow(pres / 1e3, 0.286);
  }
  function tempByEquiPotTempAndPres(thetae, pres) {
    if (pres === void 0 || isNaN(pres))
      return void 0;
    var s = void 0;
    var th = void 0;
    var pcon = Math.pow(1e3 / pres, 0.286);
    var t = 273;
    var delta = 20;
    var i = 0;
    while (Math.abs(delta) > 0.1 && i < 100) {
      i++;
      s = saturationHMRByTempAndPres(t, pres);
      th = t * pcon * Math.exp(2.5 * s / t);
      if ((th - thetae) * delta > 0)
        delta = -0.5 * delta;
      t = t + delta;
    }
    return t;
  }
  function dewpointByHMRAndPres(hmr, pres) {
    if (hmr === void 0 || isNaN(hmr) || pres === void 0 || isNaN(pres))
      return void 0;
    var x5 = 0.4343 * Math.log(hmr * pres / (622 + hmr));
    return Math.pow(10, 0.0498646455 * x5 + 2.4082965) - 7.07475 + 38.9114 * Math.pow(Math.pow(10, 0.0915 * x5) - 1.2035, 2);
  }
  function wetbulbTempByTempAndDewpointAndPres(temp, dewpoint, pres) {
    if (temp === void 0 || isNaN(temp) || dewpoint === void 0 || isNaN(dewpoint) || pres === void 0 || isNaN(pres))
      return void 0;
    var result = dewpoint - 273.15;
    var Ediff = 1;
    var incr = 10;
    var previoussign = 1;
    var E = 6.112 * Math.exp(17.67 * result / (result + 243.5));
    while (Math.abs(Ediff) > 0.05) {
      var Eguess = 6.112 * Math.exp(17.67 * result / (result + 243.5)) - pres * (temp - 273.15 - result) * 66e-5 * (1 + 115e-5 * result);
      Ediff = E - Eguess;
      if (Ediff == 0)
        break;
      else {
        if (Ediff < 0) {
          if (-1 != previoussign) {
            previoussign = -1;
            incr = incr / 10;
          }
        } else {
          if (1 != previoussign) {
            previoussign = 1;
            incr = incr / 10;
          }
        }
      }
      if (Math.abs(Ediff) <= 0.05)
        break;
      else
        result = result + incr * previoussign;
    }
    return result + 273.15;
  }
  function equiPotentialTempByTempAndDewpointAndPres(temp, dewpoint, pres) {
    var potTemp = potentialTempByTempAndPres(temp, pres);
    if (potTemp === void 0 || dewpoint === void 0 || isNaN(dewpoint) || temp === void 0 || isNaN(temp) || pres === void 0 || isNaN(pres))
      return void 0;
    return potTemp * Math.exp(2.4819 * saturationHMRByTempAndPres(dewpoint, pres) / lclTemperatureByTempAndDewpoint(temp, dewpoint));
  }
  function saturationPressureByTemp(temp) {
    if (temp === void 0 || isNaN(temp))
      return void 0;
    var coef = new Array(6.1104546, 0.4442351, 0.014302099, 26454708e-11, 30357098e-13, 20972268e-15, 60487594e-18, -1469687e-19);
    var inx = 0;
    var escold = new Array(
      0.06485546857696639,
      0.03783195122560735,
      0.02224449342887902,
      0.013182892842468312,
      0.007874020771412448,
      0.004739730494884733,
      0.0028751203550435793,
      0.001757430376758103,
      0.0010824173951885098,
      6717089391856059e-19,
      4199647026320394e-19,
      2645243638634699e-19,
      16784796373681322e-20,
      10728539763162038e-20,
      6907426344961356e-20,
      4479404897680843e-20,
      2925704195639373e-20,
      19245291263499416e-21,
      12749137241074795e-21,
      8505070102755051e-21,
      5713400253349711e-21,
      3864650296738762e-21,
      2632109719650053e-21,
      18049107293057043e-22,
      12460785055581605e-22,
      8660705713468708e-22,
      6059822176688955e-22,
      42682119794324277e-23,
      3026165085143795e-22,
      215963854234914e-21,
      15512895457833687e-23
    );
    temp = temp - 273.15;
    var retval = 0;
    if (temp > -50) {
      retval = coef[0] + temp * (coef[1] + temp * (coef[2] + temp * (coef[3] + temp * (coef[4] + temp * (coef[5] + temp * (coef[6] + temp * coef[7]))))));
    } else {
      var tt = (-temp - 50) / 5;
      if (inx < escold.length - 1) {
        retval = escold[inx] + tt % 1 * (escold[inx + 1] - escold[inx]);
      } else {
        retval = 1e-7;
      }
    }
    return retval;
  }
  function saturationHMRByTempAndPres(temp, pres) {
    var e = saturationPressureByTemp(temp);
    if (e === void 0 || pres === void 0 || isNaN(pres))
      return void 0;
    return 621.97 * e / (pres - e);
  }
  function lclByPotentialTempAndHMR(potentialTemp, hmr) {
    if (hmr === void 0 || isNaN(hmr))
      return void 0;
    var a = 1013;
    var b = 100;
    while (a - b > 10) {
      var p = b + (a - b) / 2;
      var hmrp = saturationHMRByTempAndPres(
        tempByPotentialTempAndPres(potentialTemp, p),
        p
      );
      if (hmrp === void 0)
        return void 0;
      if (hmrp < hmr)
        b = p;
      else
        a = p;
    }
    return b + (a - b) / 2;
  }
  function lclTemperatureByTempAndDewpoint(temp, dewpoint) {
    if (temp === void 0 || isNaN(temp) || dewpoint === void 0 || isNaN(dewpoint))
      return void 0;
    return dewpoint - (1296e-6 * dewpoint - 0.15772) * (temp - dewpoint);
  }
  function tempCelsiusToKelvin(temp) {
    return temp === void 0 || isNaN(temp) ? void 0 : temp + 273.15;
  }
  function tempKelvinToCelsius(temp) {
    return temp === void 0 || isNaN(temp) ? void 0 : temp - 273.15;
  }
  function windspeedMSToKMH(wind) {
    return wind === void 0 || isNaN(wind) ? void 0 : wind * 3.6;
  }
  function windspeedKMHToMS(wind) {
    return wind === void 0 || isNaN(wind) ? void 0 : wind / 3.6;
  }
  function windspeedMSToKN(wind) {
    return wind === void 0 || isNaN(wind) ? void 0 : wind * 900 / 463;
  }
  function windspeedKNToMS(wind) {
    return wind === void 0 || isNaN(wind) ? void 0 : wind * 463 / 900;
  }

  // node_modules/meteojs/Events.js
  function on(listener, callback, thisArg) {
    if (!("listeners" in this) || this.listeners === void 0)
      this.listeners = {};
    if (!(listener in this.listeners))
      this.listeners[listener] = {};
    var result_key = Math.random().toString(36).substr(2, 9);
    this.listeners[listener][result_key] = {
      callback,
      thisArg
    };
    return result_key;
  }
  function un(listener, key) {
    if ("listeners" in this && this.listeners !== void 0 && listener in this.listeners && key in this.listeners[listener])
      delete this.listeners[listener][key];
  }
  function once(listener, callback, thisArg) {
    if (!("once_listeners" in this) || this.once_listeners === void 0)
      this.once_listeners = {};
    if (!(listener in this.once_listeners) || !("push" in this.once_listeners[listener]))
      this.once_listeners[listener] = [];
    this.once_listeners[listener].push({
      callback,
      thisArg
    });
  }
  function hasListener(listener) {
    return "listeners" in this && this.listeners !== void 0 && listener in this.listeners && Object.keys(this.listeners[listener]).length || "once_listeners" in this && listener in this.once_listeners && Object.keys(this.once_listeners[listener]).length;
  }
  function trigger(listener) {
    let args = Array.prototype.slice.call(arguments);
    args.shift();
    if ("listeners" in this && this.listeners !== void 0 && listener in this.listeners && typeof this.listeners[listener] == "object") {
      Object.keys(this.listeners[listener]).forEach((key) => {
        this.listeners[listener][key].callback.apply(
          this.listeners[listener][key].thisArg === void 0 ? this : this.listeners[listener][key].thisArg,
          args
        );
      });
    }
    if ("once_listeners" in this && this.once_listeners !== void 0 && listener in this.once_listeners && "forEach" in this.once_listeners[listener]) {
      let once_listeners = this.once_listeners[listener];
      this.once_listeners[listener] = [];
      once_listeners.forEach((obj) => {
        obj.callback.apply(obj.thisArg === void 0 ? this : obj.thisArg, args);
      });
    }
  }
  function addEventFunctions(obj) {
    obj.on = on;
    obj.un = un;
    obj.once = once;
    obj.hasListener = hasListener;
    obj.trigger = trigger;
  }
  var Events_default = addEventFunctions;

  // node_modules/meteojs/base/Unique.js
  var Unique = class {
    /**
     * @param {module:meteoJS/base/unique~options} [options] - Options.
     */
    constructor({ id } = {}) {
      this._id = id;
    }
    /**
     * Id.
     * 
     * @type {mixed}
     */
    get id() {
      return this._id;
    }
    set id(id) {
      this._id = id;
      this.setId(id);
    }
    /**
     * Fired, wenn id-setter is called.
     * 
     * @protected
     * @param {mixed} id - Id.
     */
    setId() {
    }
  };
  var Unique_default = Unique;

  // node_modules/meteojs/base/Collection.js
  var Collection = class {
    /**
     * @param {module:meteoJS/base/collection~options} options - Options.
     */
    constructor({
      fireReplace = true,
      fireAddRemoveOnReplace = false,
      appendOnReplace = true,
      sortFunction,
      emptyObjectMaker
    } = {}) {
      this.options = {
        fireReplace,
        fireAddRemoveOnReplace,
        appendOnReplace,
        sortFunction,
        emptyObjectMaker
      };
      this._itemIds = [];
      this._items = {};
    }
    /**
     * Count of the items in this collection.
     * 
     * @type integer
     * @readonly
     */
    get count() {
      return this._itemIds.length;
    }
    [Symbol.iterator]() {
      let i = 0;
      return {
        next: () => {
          return i < this._itemIds.length ? { value: this._items[this._itemIds[i++]] } : { done: true };
        }
      };
    }
    /**
     * Items (ordered list).
     * 
     * @type module:meteoJS/base/unique.Unique[]
     * @readonly
     */
    get items() {
      return this._itemIds.map((id) => this._items[id]);
    }
    /**
     * List of IDs (ordered list).
     * 
     * @type mixed[]
     * @readonly
     */
    get itemIds() {
      return this._itemIds;
    }
    /**
     * Sort function for the items.
     * 
     * @type undefined|Function
     */
    get sortFunction() {
      return this.options.sortFunction;
    }
    set sortFunction(sortFunction) {
      this.options.sortFunction = sortFunction;
      this._sort();
    }
    /**
     * Returns item by ID, Unique-Object with undefined id, if ID doesn't exist.
     * 
     * @param {mixed} id - ID.
     * @returns {module:meteoJS/base/unique.Unique} Item.
     */
    getItemById(id) {
      return id in this._items ? this._items[id] : this.options.emptyObjectMaker === void 0 ? new Unique_default() : this.options.emptyObjectMaker.call(this);
    }
    /**
     * Is item appended to the collection.
     * 
     * @param {module:meteoJS/base/unique.Unique} item - Item.
     * @returns {boolean} If appended.
     */
    contains(item) {
      let result = this.containsId(item.id);
      if (result)
        result = item === this.getItemById(item.id);
      return result;
    }
    /**
     * Exists an ID in this collection.
     * 
     * @param {mixed} id - ID.
     * @returns {boolean} If exists.
     */
    containsId(id) {
      return id in this._items;
    }
    /**
     * Append an item to the collection.
     * 
     * @param {...module:meteoJS/base/unique.Unique} items - New items.
     * @returns {module:meteoJS/base/collection.Collection} This.
     * @fires module:meteoJS/base/collection#add:item
     * @fires module:meteoJS/base/collection#remove:item
     * @fires module:meteoJS/base/collection#replace:item
     */
    append(...items) {
      const addItem = [];
      const removeItem = [];
      const replaceItem = [];
      items.forEach((item) => {
        let id = item.id;
        if (this.containsId(id)) {
          let itemInCollection = this.getItemById(id);
          if (this.options.appendOnReplace) {
            this._itemIds.splice(this._itemIds.indexOf(id), 1);
            this._itemIds.push(id);
          }
          if (itemInCollection !== item) {
            this._items[id] = item;
            if (this.options.fireReplace)
              replaceItem.push([item, itemInCollection]);
            if (this.options.fireAddRemoveOnReplace) {
              removeItem.push(itemInCollection);
              addItem.push(item);
            }
          }
        } else {
          this._itemIds.push(id);
          this._items[id] = item;
          addItem.push(item);
        }
      });
      this._sort();
      addItem.forEach((item) => this.trigger("add:item", item));
      removeItem.forEach((item) => this.trigger("remove:item", item));
      replaceItem.forEach(([item, itemInCollection]) => this.trigger("replace:item", item, itemInCollection));
      return this;
    }
    /**
     * Removes an item from the collection.
     * 
     * @param {...module:meteoJS/base/unique.Unique} items - Items to remove.
     * @returns {module:meteoJS/base/collection.Collection} This.
     * @fires module:meteoJS/base/collection#remove:item
     */
    remove(...items) {
      items.forEach((item) => {
        let i = this._itemIds.indexOf(item.id);
        if (i > -1) {
          let realItem = this._items[item.id];
          delete this._items[item.id];
          this._itemIds.splice(i, 1);
          this.trigger("remove:item", realItem);
        }
      });
      return this;
    }
    /**
     * Removes an item by ID from the collection.
     * 
     * @param {mixed} id - ID of the item to delete.
     * @returns {module:meteoJS/base/collection.Collection} This.
     * @fires module:meteoJS/base/collection#remove:item
     */
    removeById(...ids) {
      ids.forEach((id) => {
        let i = this._itemIds.indexOf(id);
        if (i > -1) {
          let item = this._items[id];
          delete this._items[id];
          this._itemIds.splice(i, 1);
          this.trigger("remove:item", item);
        }
      });
      return this;
    }
    /**
     * Sorts Collection-List.
     * 
     * @private
     */
    _sort() {
      if (this.options.sortFunction === void 0)
        return;
      this._itemIds.sort((a, b) => {
        return this.options.sortFunction(this._items[a], this._items[b]);
      });
    }
  };
  Events_default(Collection.prototype);
  var Collection_default = Collection;

  // node_modules/meteojs/sounding/Parcel.js
  var Parcel = class extends Unique_default {
    /**
     * @param {module:meteoJS/sounding/parcel~options} [options] - Options.
     */
    constructor({
      id = void 0,
      pres = void 0,
      tmpc = void 0,
      dwpc = void 0,
      ptrace = void 0,
      ttrace = void 0,
      blayer = void 0,
      tlayer = void 0,
      lclpres = void 0,
      lclhght = void 0,
      lfcpres = void 0,
      lfchght = void 0,
      elpres = void 0,
      elhght = void 0,
      mplpres = void 0,
      mplhght = void 0,
      bplus = void 0,
      bminus = void 0,
      bfzl = void 0,
      b3km = void 0,
      b6km = void 0,
      p0c = void 0,
      pm10c = void 0,
      pm20c = void 0,
      pm30c = void 0,
      hght0c = void 0,
      hghtm10c = void 0,
      hghtm20c = void 0,
      hghtm30c = void 0,
      wm10c = void 0,
      wm20c = void 0,
      wm30c = void 0,
      li5 = void 0,
      li3 = void 0,
      brnshear = void 0,
      brnu = void 0,
      brnv = void 0,
      limax = void 0,
      limaxpres = void 0,
      cap = void 0,
      cappres = void 0,
      bmin = void 0,
      bminpres = void 0
    } = {}) {
      super({ id });
      this.pres = pres;
      this.tmpc = tmpc;
      this.dwpc = dwpc;
      this.ptrace = ptrace;
      this.ttrace = ttrace;
      this.blayer = blayer;
      this.tlayer = tlayer;
      this.lclpres = lclpres;
      this.lclhght = lclhght;
      this.lfcpres = lfcpres;
      this.lfchght = lfchght;
      this.elpres = elpres;
      this.elhght = elhght;
      this.mplpres = mplpres;
      this.mplhght = mplhght;
      this.bplus = bplus;
      this.bminus = bminus;
      this.bfzl = bfzl;
      this.b3km = b3km;
      this.b6km = b6km;
      this.p0c = p0c;
      this.pm10c = pm10c;
      this.pm20c = pm20c;
      this.pm30c = pm30c;
      this.hght0c = hght0c;
      this.hghtm10c = hghtm10c;
      this.hghtm20c = hghtm20c;
      this.hghtm30c = hghtm30c;
      this.wm10c = wm10c;
      this.wm20c = wm20c;
      this.wm30c = wm30c;
      this.li5 = li5;
      this.li3 = li3;
      this.brnshear = brnshear;
      this.brnu = brnu;
      this.brnv = brnv;
      this.limax = limax;
      this.limaxpres = limaxpres;
      this.cap = cap;
      this.cappres = cappres;
      this.bmin = bmin;
      this.bminpres = bminpres;
    }
  };
  var Parcel_default = Parcel;

  // node_modules/meteojs/Sounding.js
  var Sounding = class {
    /**
     * @param {module:meteoJS/sounding~options} [options] - Options.
     */
    constructor({
      calcMissing = false,
      parcels = []
    } = {}) {
      this.options = {
        calcMissing
      };
      this.levels = {};
      this._parcelCollection = new Collection_default({
        fireAddRemoveOnReplace: true,
        fireReplace: false,
        emptyObjectMaker: () => new Parcel_default()
      });
      this._parcelCollection.append(...parcels);
    }
    /**
     * @type module:meteoJS/base/collection.Collection
     * @public
     * @readonly
     */
    get parcelCollection() {
      return this._parcelCollection;
    }
    /**
     * Adds/replaces sounding data.
     * 
     * @param {module:meteoJS/sounding~levelData[]} levelsData
     *   Array with data at different levels.
     * @param {module:meteoJS/sounding~options} [options] - Options.
     * @returns {module:meteoJS/sounding.Sounding} This.
     */
    addLevels(levelsData, options) {
      levelsData.forEach(function(levelData) {
        this.addLevel(levelData, options);
      }, this);
      return this;
    }
    /**
     * Adds/replaces Data for a certain level.
     * 
     * @param {module:meteoJS/sounding~levelData} levelData - Data to add.
     * @param {module:meteoJS/sounding~options} [options] - Options.
     * @returns {module:meteoJS/sounding.Sounding} This.
     */
    addLevel(levelData, { calcMissing } = {}) {
      calcMissing = calcMissing ? calcMissing : this.options.calcMissing;
      if ("pres" in levelData && levelData.pres !== void 0) {
        if (calcMissing)
          levelData = this.calculateMissingData(levelData);
        this.levels[levelData.pres] = levelData;
      }
      return this;
    }
    /**
     * Calculates different parameters, if missing.
     * 
     * @param {module:meteoJS/sounding~levelData} d - Data.
     * @returns {module:meteoJS/sounding~levelData} Adjusted data.
     */
    calculateMissingData({
      pres,
      hght,
      u,
      v,
      wdir,
      wspd,
      tmpk,
      dwpk,
      relh,
      mixr,
      theta,
      thetae,
      wetbulb,
      vtmp
    }) {
      let d = {
        pres,
        hght,
        u,
        v,
        wdir,
        wspd,
        tmpk,
        dwpk,
        relh,
        mixr,
        theta,
        thetae,
        wetbulb,
        vtmp
      };
      if (d.hght === void 0)
        d.hght = altitudeISAByPres(d.pres);
      if (d.u === void 0 && d.v === void 0 && d.wdir !== void 0 && d.wspd !== void 0) {
        d.u = -d.wspd * Math.sin(d.wdir / 180 * Math.PI);
        d.v = -d.wspd * Math.cos(d.wdir / 180 * Math.PI);
      } else if (d.u !== void 0 && d.v !== void 0 && d.wdir === void 0 && d.wspd === void 0) {
        d.wspd = Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2));
        d.wdir = 270 - Math.atan2(d.v, d.u) / Math.PI * 180;
      }
      if (d.tmpk !== void 0 && d.dwpk !== void 0) {
        if (d.theta === void 0)
          d.theta = potentialTempByTempAndPres(d.tmpk, d.pres);
        if (d.thetae === void 0)
          d.thetae = equiPotentialTempByTempAndDewpointAndPres(d.tmpk, d.dwpk, d.pres);
      } else if (d.mixr !== void 0) {
        if (d.dwpk === void 0)
          d.dwpk = dewpointByHMRAndPres(d.mixr, d.pres);
      }
      return d;
    }
    /**
     * Removes the Data for a certain level (if existing).
     * 
     * @param {float} pres - Remove the data at this Level [hPa].
     * @returns {module:meteoJS/sounding.Sounding} this.
     */
    removeLevel(pres) {
      if (pres in this.levels)
        delete this.levels[pres];
      return this;
    }
    /**
     * Get the data for a specific level. Returns the levelData as passed to the
     * constructor or addLevel.
     * 
     * @param {float} pres - Level [hPa].
     * @returns {module:meteoJS/sounding~levelData|undefined}
     *   Data at a level, undefined if no data available.
     */
    getData(pres) {
      return pres in this.levels ? this.levels[pres] : {
        pres: void 0,
        hght: void 0,
        tmpk: void 0,
        dwpk: void 0,
        wdir: void 0,
        wspd: void 0,
        u: void 0,
        v: void 0,
        relh: void 0,
        mixr: void 0,
        theta: void 0,
        thetae: void 0,
        wetbulb: void 0,
        vtmp: void 0
      };
    }
    /**
     * Get data for all defined levels. Upward sorted.
     * 
     * @returns {module:meteoJS/sounding~levelData[]} Array of all the data.
     */
    getLevels() {
      return Object.keys(this.levels).map(function(pres) {
        return +pres;
      }).sort(function(a, b) {
        return a - b;
      });
    }
    /**
     * Get nearest level [hPa] with data.
     * 
     * @param {float} pres Pressure [hPa].
     * @returns {float|undefined} Level with data or undefined. [hPa]
     */
    getNearestLevel(pres) {
      if (Object.keys(this.levels).length < 1)
        return void 0;
      return Object.keys(this.levels).sort(function(levelA, levelB) {
        return Math.abs(levelA - pres) - Math.abs(levelB - pres);
      }).shift();
    }
  };
  var Sounding_default = Sounding;

  // node_modules/@svgdotjs/svg.js/src/utils/methods.js
  var methods = {};
  var names = [];
  function registerMethods(name, m) {
    if (Array.isArray(name)) {
      for (const _name of name) {
        registerMethods(_name, m);
      }
      return;
    }
    if (typeof name === "object") {
      for (const _name in name) {
        registerMethods(_name, name[_name]);
      }
      return;
    }
    addMethodNames(Object.getOwnPropertyNames(m));
    methods[name] = Object.assign(methods[name] || {}, m);
  }
  function getMethodsFor(name) {
    return methods[name] || {};
  }
  function getMethodNames() {
    return [...new Set(names)];
  }
  function addMethodNames(_names) {
    names.push(..._names);
  }

  // node_modules/@svgdotjs/svg.js/src/utils/utils.js
  function map(array2, block) {
    let i;
    const il = array2.length;
    const result = [];
    for (i = 0; i < il; i++) {
      result.push(block(array2[i]));
    }
    return result;
  }
  function filter(array2, block) {
    let i;
    const il = array2.length;
    const result = [];
    for (i = 0; i < il; i++) {
      if (block(array2[i])) {
        result.push(array2[i]);
      }
    }
    return result;
  }
  function radians(d) {
    return d % 360 * Math.PI / 180;
  }
  function unCamelCase(s) {
    return s.replace(/([A-Z])/g, function(m, g) {
      return "-" + g.toLowerCase();
    });
  }
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function proportionalSize(element, width4, height4, box) {
    if (width4 == null || height4 == null) {
      box = box || element.bbox();
      if (width4 == null) {
        width4 = box.width / box.height * height4;
      } else if (height4 == null) {
        height4 = box.height / box.width * width4;
      }
    }
    return {
      width: width4,
      height: height4
    };
  }
  function getOrigin(o, element) {
    const origin = o.origin;
    let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : "center";
    let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : "center";
    if (origin != null) {
      ;
      [ox, oy] = Array.isArray(origin) ? origin : typeof origin === "object" ? [origin.x, origin.y] : [origin, origin];
    }
    const condX = typeof ox === "string";
    const condY = typeof oy === "string";
    if (condX || condY) {
      const { height: height4, width: width4, x: x5, y: y5 } = element.bbox();
      if (condX) {
        ox = ox.includes("left") ? x5 : ox.includes("right") ? x5 + width4 : x5 + width4 / 2;
      }
      if (condY) {
        oy = oy.includes("top") ? y5 : oy.includes("bottom") ? y5 + height4 : y5 + height4 / 2;
      }
    }
    return [ox, oy];
  }
  var descriptiveElements = /* @__PURE__ */ new Set(["desc", "metadata", "title"]);
  var isDescriptive = (element) => descriptiveElements.has(element.nodeName);
  var writeDataToDom = (element, data2, defaults = {}) => {
    const cloned = { ...data2 };
    for (const key in cloned) {
      if (cloned[key].valueOf() === defaults[key]) {
        delete cloned[key];
      }
    }
    if (Object.keys(cloned).length) {
      element.node.setAttribute("data-svgjs", JSON.stringify(cloned));
    } else {
      element.node.removeAttribute("data-svgjs");
      element.node.removeAttribute("svgjs:data");
    }
  };

  // node_modules/@svgdotjs/svg.js/src/modules/core/namespaces.js
  var svg = "http://www.w3.org/2000/svg";
  var html = "http://www.w3.org/1999/xhtml";
  var xmlns = "http://www.w3.org/2000/xmlns/";
  var xlink = "http://www.w3.org/1999/xlink";

  // node_modules/@svgdotjs/svg.js/src/utils/window.js
  var globals = {
    window: typeof window === "undefined" ? null : window,
    document: typeof document === "undefined" ? null : document
  };
  function getWindow() {
    return globals.window;
  }

  // node_modules/@svgdotjs/svg.js/src/types/Base.js
  var Base = class {
    // constructor (node/*, {extensions = []} */) {
    //   // this.tags = []
    //   //
    //   // for (let extension of extensions) {
    //   //   extension.setup.call(this, node)
    //   //   this.tags.push(extension.name)
    //   // }
    // }
  };

  // node_modules/@svgdotjs/svg.js/src/utils/adopter.js
  var elements = {};
  var root = "___SYMBOL___ROOT___";
  function create(name, ns = svg) {
    return globals.document.createElementNS(ns, name);
  }
  function makeInstance(element, isHTML = false) {
    if (element instanceof Base) return element;
    if (typeof element === "object") {
      return adopter(element);
    }
    if (element == null) {
      return new elements[root]();
    }
    if (typeof element === "string" && element.trim().charAt(0) !== "<") {
      return adopter(globals.document.querySelector(element));
    }
    const wrapper = isHTML ? globals.document.createElement("div") : create("svg");
    wrapper.innerHTML = element.trim();
    element = adopter(wrapper.firstElementChild);
    wrapper.removeChild(wrapper.firstElementChild);
    return element;
  }
  function nodeOrNew(name, node) {
    return node && (node instanceof globals.window.Node || node.ownerDocument && node instanceof node.ownerDocument.defaultView.Node) ? node : create(name);
  }
  function adopt(node) {
    if (!node) return null;
    if (node.instance instanceof Base) return node.instance;
    if (node.nodeName === "#document-fragment") {
      return new elements.Fragment(node);
    }
    let className = capitalize(node.nodeName || "Dom");
    if (className === "LinearGradient" || className === "RadialGradient") {
      className = "Gradient";
    } else if (!elements[className]) {
      className = "Dom";
    }
    return new elements[className](node);
  }
  var adopter = adopt;
  function register(element, name = element.name, asRoot = false) {
    elements[name] = element;
    if (asRoot) elements[root] = element;
    addMethodNames(Object.getOwnPropertyNames(element.prototype));
    return element;
  }
  function getClass(name) {
    return elements[name];
  }
  var did = 1e3;
  function eid(name) {
    return "Svgjs" + capitalize(name) + did++;
  }
  function assignNewId(node) {
    for (let i = node.children.length - 1; i >= 0; i--) {
      assignNewId(node.children[i]);
    }
    if (node.id) {
      node.id = eid(node.nodeName);
      return node;
    }
    return node;
  }
  function extend(modules, methods3) {
    let key, i;
    modules = Array.isArray(modules) ? modules : [modules];
    for (i = modules.length - 1; i >= 0; i--) {
      for (key in methods3) {
        modules[i].prototype[key] = methods3[key];
      }
    }
  }
  function wrapWithAttrCheck(fn) {
    return function(...args) {
      const o = args[args.length - 1];
      if (o && o.constructor === Object && !(o instanceof Array)) {
        return fn.apply(this, args.slice(0, -1)).attr(o);
      } else {
        return fn.apply(this, args);
      }
    };
  }

  // node_modules/@svgdotjs/svg.js/src/modules/optional/arrange.js
  function siblings() {
    return this.parent().children();
  }
  function position() {
    return this.parent().index(this);
  }
  function next() {
    return this.siblings()[this.position() + 1];
  }
  function prev() {
    return this.siblings()[this.position() - 1];
  }
  function forward() {
    const i = this.position();
    const p = this.parent();
    p.add(this.remove(), i + 1);
    return this;
  }
  function backward() {
    const i = this.position();
    const p = this.parent();
    p.add(this.remove(), i ? i - 1 : 0);
    return this;
  }
  function front() {
    const p = this.parent();
    p.add(this.remove());
    return this;
  }
  function back() {
    const p = this.parent();
    p.add(this.remove(), 0);
    return this;
  }
  function before(element) {
    element = makeInstance(element);
    element.remove();
    const i = this.position();
    this.parent().add(element, i);
    return this;
  }
  function after(element) {
    element = makeInstance(element);
    element.remove();
    const i = this.position();
    this.parent().add(element, i + 1);
    return this;
  }
  function insertBefore(element) {
    element = makeInstance(element);
    element.before(this);
    return this;
  }
  function insertAfter(element) {
    element = makeInstance(element);
    element.after(this);
    return this;
  }
  registerMethods("Dom", {
    siblings,
    position,
    next,
    prev,
    forward,
    backward,
    front,
    back,
    before,
    after,
    insertBefore,
    insertAfter
  });

  // node_modules/@svgdotjs/svg.js/src/modules/core/regex.js
  var numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;
  var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  var rgb = /rgb\((\d+),(\d+),(\d+)\)/;
  var reference = /(#[a-z_][a-z0-9\-_]*)/i;
  var transforms = /\)\s*,?\s*/;
  var whitespace = /\s/g;
  var isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;
  var isRgb = /^rgb\(/;
  var isBlank = /^(\s+)?$/;
  var isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  var isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;
  var delimiter = /[\s,]+/;
  var isPathLetter = /[MLHVCSQTAZ]/i;

  // node_modules/@svgdotjs/svg.js/src/modules/optional/class.js
  function classes() {
    const attr2 = this.attr("class");
    return attr2 == null ? [] : attr2.trim().split(delimiter);
  }
  function hasClass(name) {
    return this.classes().indexOf(name) !== -1;
  }
  function addClass(name) {
    if (!this.hasClass(name)) {
      const array2 = this.classes();
      array2.push(name);
      this.attr("class", array2.join(" "));
    }
    return this;
  }
  function removeClass(name) {
    if (this.hasClass(name)) {
      this.attr(
        "class",
        this.classes().filter(function(c) {
          return c !== name;
        }).join(" ")
      );
    }
    return this;
  }
  function toggleClass(name) {
    return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
  }
  registerMethods("Dom", {
    classes,
    hasClass,
    addClass,
    removeClass,
    toggleClass
  });

  // node_modules/@svgdotjs/svg.js/src/modules/optional/css.js
  function css(style, val) {
    const ret = {};
    if (arguments.length === 0) {
      this.node.style.cssText.split(/\s*;\s*/).filter(function(el) {
        return !!el.length;
      }).forEach(function(el) {
        const t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
      return ret;
    }
    if (arguments.length < 2) {
      if (Array.isArray(style)) {
        for (const name of style) {
          const cased = name;
          ret[name] = this.node.style.getPropertyValue(cased);
        }
        return ret;
      }
      if (typeof style === "string") {
        return this.node.style.getPropertyValue(style);
      }
      if (typeof style === "object") {
        for (const name in style) {
          this.node.style.setProperty(
            name,
            style[name] == null || isBlank.test(style[name]) ? "" : style[name]
          );
        }
      }
    }
    if (arguments.length === 2) {
      this.node.style.setProperty(
        style,
        val == null || isBlank.test(val) ? "" : val
      );
    }
    return this;
  }
  function show() {
    return this.css("display", "");
  }
  function hide() {
    return this.css("display", "none");
  }
  function visible() {
    return this.css("display") !== "none";
  }
  registerMethods("Dom", {
    css,
    show,
    hide,
    visible
  });

  // node_modules/@svgdotjs/svg.js/src/modules/optional/data.js
  function data(a, v, r) {
    if (a == null) {
      return this.data(
        map(
          filter(
            this.node.attributes,
            (el) => el.nodeName.indexOf("data-") === 0
          ),
          (el) => el.nodeName.slice(5)
        )
      );
    } else if (a instanceof Array) {
      const data2 = {};
      for (const key of a) {
        data2[key] = this.data(key);
      }
      return data2;
    } else if (typeof a === "object") {
      for (v in a) {
        this.data(v, a[v]);
      }
    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr("data-" + a));
      } catch (e) {
        return this.attr("data-" + a);
      }
    } else {
      this.attr(
        "data-" + a,
        v === null ? null : r === true || typeof v === "string" || typeof v === "number" ? v : JSON.stringify(v)
      );
    }
    return this;
  }
  registerMethods("Dom", { data });

  // node_modules/@svgdotjs/svg.js/src/modules/optional/memory.js
  function remember(k2, v) {
    if (typeof arguments[0] === "object") {
      for (const key in k2) {
        this.remember(key, k2[key]);
      }
    } else if (arguments.length === 1) {
      return this.memory()[k2];
    } else {
      this.memory()[k2] = v;
    }
    return this;
  }
  function forget() {
    if (arguments.length === 0) {
      this._memory = {};
    } else {
      for (let i = arguments.length - 1; i >= 0; i--) {
        delete this.memory()[arguments[i]];
      }
    }
    return this;
  }
  function memory() {
    return this._memory = this._memory || {};
  }
  registerMethods("Dom", { remember, forget, memory });

  // node_modules/@svgdotjs/svg.js/src/types/Color.js
  function sixDigitHex(hex2) {
    return hex2.length === 4 ? [
      "#",
      hex2.substring(1, 2),
      hex2.substring(1, 2),
      hex2.substring(2, 3),
      hex2.substring(2, 3),
      hex2.substring(3, 4),
      hex2.substring(3, 4)
    ].join("") : hex2;
  }
  function componentHex(component) {
    const integer = Math.round(component);
    const bounded = Math.max(0, Math.min(255, integer));
    const hex2 = bounded.toString(16);
    return hex2.length === 1 ? "0" + hex2 : hex2;
  }
  function is(object, space) {
    for (let i = space.length; i--; ) {
      if (object[space[i]] == null) {
        return false;
      }
    }
    return true;
  }
  function getParameters(a, b) {
    const params = is(a, "rgb") ? { _a: a.r, _b: a.g, _c: a.b, _d: 0, space: "rgb" } : is(a, "xyz") ? { _a: a.x, _b: a.y, _c: a.z, _d: 0, space: "xyz" } : is(a, "hsl") ? { _a: a.h, _b: a.s, _c: a.l, _d: 0, space: "hsl" } : is(a, "lab") ? { _a: a.l, _b: a.a, _c: a.b, _d: 0, space: "lab" } : is(a, "lch") ? { _a: a.l, _b: a.c, _c: a.h, _d: 0, space: "lch" } : is(a, "cmyk") ? { _a: a.c, _b: a.m, _c: a.y, _d: a.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
    params.space = b || params.space;
    return params;
  }
  function cieSpace(space) {
    if (space === "lab" || space === "xyz" || space === "lch") {
      return true;
    } else {
      return false;
    }
  }
  function hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  var Color = class _Color {
    constructor(...inputs) {
      this.init(...inputs);
    }
    // Test if given value is a color
    static isColor(color) {
      return color && (color instanceof _Color || this.isRgb(color) || this.test(color));
    }
    // Test if given value is an rgb object
    static isRgb(color) {
      return color && typeof color.r === "number" && typeof color.g === "number" && typeof color.b === "number";
    }
    /*
    Generating random colors
    */
    static random(mode = "vibrant", t) {
      const { random, round, sin, PI: pi } = Math;
      if (mode === "vibrant") {
        const l = (81 - 57) * random() + 57;
        const c = (83 - 45) * random() + 45;
        const h = 360 * random();
        const color = new _Color(l, c, h, "lch");
        return color;
      } else if (mode === "sine") {
        t = t == null ? random() : t;
        const r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
        const g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
        const b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);
        const color = new _Color(r, g, b);
        return color;
      } else if (mode === "pastel") {
        const l = (94 - 86) * random() + 86;
        const c = (26 - 9) * random() + 9;
        const h = 360 * random();
        const color = new _Color(l, c, h, "lch");
        return color;
      } else if (mode === "dark") {
        const l = 10 + 10 * random();
        const c = (125 - 75) * random() + 86;
        const h = 360 * random();
        const color = new _Color(l, c, h, "lch");
        return color;
      } else if (mode === "rgb") {
        const r = 255 * random();
        const g = 255 * random();
        const b = 255 * random();
        const color = new _Color(r, g, b);
        return color;
      } else if (mode === "lab") {
        const l = 100 * random();
        const a = 256 * random() - 128;
        const b = 256 * random() - 128;
        const color = new _Color(l, a, b, "lab");
        return color;
      } else if (mode === "grey") {
        const grey = 255 * random();
        const color = new _Color(grey, grey, grey);
        return color;
      } else {
        throw new Error("Unsupported random color mode");
      }
    }
    // Test if given value is a color string
    static test(color) {
      return typeof color === "string" && (isHex.test(color) || isRgb.test(color));
    }
    cmyk() {
      const { _a, _b, _c } = this.rgb();
      const [r, g, b] = [_a, _b, _c].map((v) => v / 255);
      const k2 = Math.min(1 - r, 1 - g, 1 - b);
      if (k2 === 1) {
        return new _Color(0, 0, 0, 1, "cmyk");
      }
      const c = (1 - r - k2) / (1 - k2);
      const m = (1 - g - k2) / (1 - k2);
      const y5 = (1 - b - k2) / (1 - k2);
      const color = new _Color(c, m, y5, k2, "cmyk");
      return color;
    }
    hsl() {
      const { _a, _b, _c } = this.rgb();
      const [r, g, b] = [_a, _b, _c].map((v) => v / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const isGrey = max === min;
      const delta = max - min;
      const s = isGrey ? 0 : l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      const h = isGrey ? 0 : max === r ? ((g - b) / delta + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / delta + 2) / 6 : max === b ? ((r - g) / delta + 4) / 6 : 0;
      const color = new _Color(360 * h, 100 * s, 100 * l, "hsl");
      return color;
    }
    init(a = 0, b = 0, c = 0, d = 0, space = "rgb") {
      a = !a ? 0 : a;
      if (this.space) {
        for (const component in this.space) {
          delete this[this.space[component]];
        }
      }
      if (typeof a === "number") {
        space = typeof d === "string" ? d : space;
        d = typeof d === "string" ? 0 : d;
        Object.assign(this, { _a: a, _b: b, _c: c, _d: d, space });
      } else if (a instanceof Array) {
        this.space = b || (typeof a[3] === "string" ? a[3] : a[4]) || "rgb";
        Object.assign(this, { _a: a[0], _b: a[1], _c: a[2], _d: a[3] || 0 });
      } else if (a instanceof Object) {
        const values = getParameters(a, b);
        Object.assign(this, values);
      } else if (typeof a === "string") {
        if (isRgb.test(a)) {
          const noWhitespace = a.replace(whitespace, "");
          const [_a2, _b2, _c2] = rgb.exec(noWhitespace).slice(1, 4).map((v) => parseInt(v));
          Object.assign(this, { _a: _a2, _b: _b2, _c: _c2, _d: 0, space: "rgb" });
        } else if (isHex.test(a)) {
          const hexParse = (v) => parseInt(v, 16);
          const [, _a2, _b2, _c2] = hex.exec(sixDigitHex(a)).map(hexParse);
          Object.assign(this, { _a: _a2, _b: _b2, _c: _c2, _d: 0, space: "rgb" });
        } else throw Error("Unsupported string format, can't construct Color");
      }
      const { _a, _b, _c, _d } = this;
      const components = this.space === "rgb" ? { r: _a, g: _b, b: _c } : this.space === "xyz" ? { x: _a, y: _b, z: _c } : this.space === "hsl" ? { h: _a, s: _b, l: _c } : this.space === "lab" ? { l: _a, a: _b, b: _c } : this.space === "lch" ? { l: _a, c: _b, h: _c } : this.space === "cmyk" ? { c: _a, m: _b, y: _c, k: _d } : {};
      Object.assign(this, components);
    }
    lab() {
      const { x: x5, y: y5, z } = this.xyz();
      const l = 116 * y5 - 16;
      const a = 500 * (x5 - y5);
      const b = 200 * (y5 - z);
      const color = new _Color(l, a, b, "lab");
      return color;
    }
    lch() {
      const { l, a, b } = this.lab();
      const c = Math.sqrt(a ** 2 + b ** 2);
      let h = 180 * Math.atan2(b, a) / Math.PI;
      if (h < 0) {
        h *= -1;
        h = 360 - h;
      }
      const color = new _Color(l, c, h, "lch");
      return color;
    }
    /*
    Conversion Methods
    */
    rgb() {
      if (this.space === "rgb") {
        return this;
      } else if (cieSpace(this.space)) {
        let { x: x5, y: y5, z } = this;
        if (this.space === "lab" || this.space === "lch") {
          let { l, a, b: b2 } = this;
          if (this.space === "lch") {
            const { c, h } = this;
            const dToR = Math.PI / 180;
            a = c * Math.cos(dToR * h);
            b2 = c * Math.sin(dToR * h);
          }
          const yL = (l + 16) / 116;
          const xL = a / 500 + yL;
          const zL = yL - b2 / 200;
          const ct = 16 / 116;
          const mx = 8856e-6;
          const nm = 7.787;
          x5 = 0.95047 * (xL ** 3 > mx ? xL ** 3 : (xL - ct) / nm);
          y5 = 1 * (yL ** 3 > mx ? yL ** 3 : (yL - ct) / nm);
          z = 1.08883 * (zL ** 3 > mx ? zL ** 3 : (zL - ct) / nm);
        }
        const rU = x5 * 3.2406 + y5 * -1.5372 + z * -0.4986;
        const gU = x5 * -0.9689 + y5 * 1.8758 + z * 0.0415;
        const bU = x5 * 0.0557 + y5 * -0.204 + z * 1.057;
        const pow = Math.pow;
        const bd = 31308e-7;
        const r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
        const g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
        const b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU;
        const color = new _Color(255 * r, 255 * g, 255 * b);
        return color;
      } else if (this.space === "hsl") {
        let { h, s, l } = this;
        h /= 360;
        s /= 100;
        l /= 100;
        if (s === 0) {
          l *= 255;
          const color2 = new _Color(l, l, l);
          return color2;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = 255 * hueToRgb(p, q, h + 1 / 3);
        const g = 255 * hueToRgb(p, q, h);
        const b = 255 * hueToRgb(p, q, h - 1 / 3);
        const color = new _Color(r, g, b);
        return color;
      } else if (this.space === "cmyk") {
        const { c, m, y: y5, k: k2 } = this;
        const r = 255 * (1 - Math.min(1, c * (1 - k2) + k2));
        const g = 255 * (1 - Math.min(1, m * (1 - k2) + k2));
        const b = 255 * (1 - Math.min(1, y5 * (1 - k2) + k2));
        const color = new _Color(r, g, b);
        return color;
      } else {
        return this;
      }
    }
    toArray() {
      const { _a, _b, _c, _d, space } = this;
      return [_a, _b, _c, _d, space];
    }
    toHex() {
      const [r, g, b] = this._clamped().map(componentHex);
      return `#${r}${g}${b}`;
    }
    toRgb() {
      const [rV, gV, bV] = this._clamped();
      const string = `rgb(${rV},${gV},${bV})`;
      return string;
    }
    toString() {
      return this.toHex();
    }
    xyz() {
      const { _a: r255, _b: g255, _c: b255 } = this.rgb();
      const [r, g, b] = [r255, g255, b255].map((v) => v / 255);
      const rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      const gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      const bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      const xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
      const yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1;
      const zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;
      const x5 = xU > 8856e-6 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
      const y5 = yU > 8856e-6 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
      const z = zU > 8856e-6 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116;
      const color = new _Color(x5, y5, z, "xyz");
      return color;
    }
    /*
    Input and Output methods
    */
    _clamped() {
      const { _a, _b, _c } = this.rgb();
      const { max, min, round } = Math;
      const format = (v) => max(0, min(round(v), 255));
      return [_a, _b, _c].map(format);
    }
    /*
    Constructing colors
    */
  };

  // node_modules/@svgdotjs/svg.js/src/types/Point.js
  var Point = class _Point {
    // Initialize
    constructor(...args) {
      this.init(...args);
    }
    // Clone point
    clone() {
      return new _Point(this);
    }
    init(x5, y5) {
      const base = { x: 0, y: 0 };
      const source = Array.isArray(x5) ? { x: x5[0], y: x5[1] } : typeof x5 === "object" ? { x: x5.x, y: x5.y } : { x: x5, y: y5 };
      this.x = source.x == null ? base.x : source.x;
      this.y = source.y == null ? base.y : source.y;
      return this;
    }
    toArray() {
      return [this.x, this.y];
    }
    transform(m) {
      return this.clone().transformO(m);
    }
    // Transform point with matrix
    transformO(m) {
      if (!Matrix.isMatrixLike(m)) {
        m = new Matrix(m);
      }
      const { x: x5, y: y5 } = this;
      this.x = m.a * x5 + m.c * y5 + m.e;
      this.y = m.b * x5 + m.d * y5 + m.f;
      return this;
    }
  };
  function point(x5, y5) {
    return new Point(x5, y5).transformO(this.screenCTM().inverseO());
  }

  // node_modules/@svgdotjs/svg.js/src/types/Matrix.js
  function closeEnough(a, b, threshold) {
    return Math.abs(b - a) < (threshold || 1e-6);
  }
  var Matrix = class _Matrix {
    constructor(...args) {
      this.init(...args);
    }
    static formatTransforms(o) {
      const flipBoth = o.flip === "both" || o.flip === true;
      const flipX = o.flip && (flipBoth || o.flip === "x") ? -1 : 1;
      const flipY = o.flip && (flipBoth || o.flip === "y") ? -1 : 1;
      const skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
      const skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
      const scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
      const scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
      const shear = o.shear || 0;
      const theta = o.rotate || o.theta || 0;
      const origin = new Point(
        o.origin || o.around || o.ox || o.originX,
        o.oy || o.originY
      );
      const ox = origin.x;
      const oy = origin.y;
      const position2 = new Point(
        o.position || o.px || o.positionX || NaN,
        o.py || o.positionY || NaN
      );
      const px = position2.x;
      const py = position2.y;
      const translate = new Point(
        o.translate || o.tx || o.translateX,
        o.ty || o.translateY
      );
      const tx = translate.x;
      const ty = translate.y;
      const relative = new Point(
        o.relative || o.rx || o.relativeX,
        o.ry || o.relativeY
      );
      const rx2 = relative.x;
      const ry2 = relative.y;
      return {
        scaleX,
        scaleY,
        skewX,
        skewY,
        shear,
        theta,
        rx: rx2,
        ry: ry2,
        tx,
        ty,
        ox,
        oy,
        px,
        py
      };
    }
    static fromArray(a) {
      return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] };
    }
    static isMatrixLike(o) {
      return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
    }
    // left matrix, right matrix, target matrix which is overwritten
    static matrixMultiply(l, r, o) {
      const a = l.a * r.a + l.c * r.b;
      const b = l.b * r.a + l.d * r.b;
      const c = l.a * r.c + l.c * r.d;
      const d = l.b * r.c + l.d * r.d;
      const e = l.e + l.a * r.e + l.c * r.f;
      const f = l.f + l.b * r.e + l.d * r.f;
      o.a = a;
      o.b = b;
      o.c = c;
      o.d = d;
      o.e = e;
      o.f = f;
      return o;
    }
    around(cx3, cy3, matrix) {
      return this.clone().aroundO(cx3, cy3, matrix);
    }
    // Transform around a center point
    aroundO(cx3, cy3, matrix) {
      const dx2 = cx3 || 0;
      const dy2 = cy3 || 0;
      return this.translateO(-dx2, -dy2).lmultiplyO(matrix).translateO(dx2, dy2);
    }
    // Clones this matrix
    clone() {
      return new _Matrix(this);
    }
    // Decomposes this matrix into its affine parameters
    decompose(cx3 = 0, cy3 = 0) {
      const a = this.a;
      const b = this.b;
      const c = this.c;
      const d = this.d;
      const e = this.e;
      const f = this.f;
      const determinant = a * d - b * c;
      const ccw = determinant > 0 ? 1 : -1;
      const sx = ccw * Math.sqrt(a * a + b * b);
      const thetaRad = Math.atan2(ccw * b, ccw * a);
      const theta = 180 / Math.PI * thetaRad;
      const ct = Math.cos(thetaRad);
      const st = Math.sin(thetaRad);
      const lam = (a * c + b * d) / determinant;
      const sy = c * sx / (lam * a - b) || d * sx / (lam * b + a);
      const tx = e - cx3 + cx3 * ct * sx + cy3 * (lam * ct * sx - st * sy);
      const ty = f - cy3 + cx3 * st * sx + cy3 * (lam * st * sx + ct * sy);
      return {
        // Return the affine parameters
        scaleX: sx,
        scaleY: sy,
        shear: lam,
        rotate: theta,
        translateX: tx,
        translateY: ty,
        originX: cx3,
        originY: cy3,
        // Return the matrix parameters
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      };
    }
    // Check if two matrices are equal
    equals(other) {
      if (other === this) return true;
      const comp = new _Matrix(other);
      return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
    }
    // Flip matrix on x or y, at a given offset
    flip(axis, around) {
      return this.clone().flipO(axis, around);
    }
    flipO(axis, around) {
      return axis === "x" ? this.scaleO(-1, 1, around, 0) : axis === "y" ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis);
    }
    // Initialize
    init(source) {
      const base = _Matrix.fromArray([1, 0, 0, 1, 0, 0]);
      source = source instanceof Element ? source.matrixify() : typeof source === "string" ? _Matrix.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? _Matrix.fromArray(source) : typeof source === "object" && _Matrix.isMatrixLike(source) ? source : typeof source === "object" ? new _Matrix().transform(source) : arguments.length === 6 ? _Matrix.fromArray([].slice.call(arguments)) : base;
      this.a = source.a != null ? source.a : base.a;
      this.b = source.b != null ? source.b : base.b;
      this.c = source.c != null ? source.c : base.c;
      this.d = source.d != null ? source.d : base.d;
      this.e = source.e != null ? source.e : base.e;
      this.f = source.f != null ? source.f : base.f;
      return this;
    }
    inverse() {
      return this.clone().inverseO();
    }
    // Inverses matrix
    inverseO() {
      const a = this.a;
      const b = this.b;
      const c = this.c;
      const d = this.d;
      const e = this.e;
      const f = this.f;
      const det = a * d - b * c;
      if (!det) throw new Error("Cannot invert " + this);
      const na = d / det;
      const nb = -b / det;
      const nc = -c / det;
      const nd = a / det;
      const ne = -(na * e + nc * f);
      const nf = -(nb * e + nd * f);
      this.a = na;
      this.b = nb;
      this.c = nc;
      this.d = nd;
      this.e = ne;
      this.f = nf;
      return this;
    }
    lmultiply(matrix) {
      return this.clone().lmultiplyO(matrix);
    }
    lmultiplyO(matrix) {
      const r = this;
      const l = matrix instanceof _Matrix ? matrix : new _Matrix(matrix);
      return _Matrix.matrixMultiply(l, r, this);
    }
    // Left multiplies by the given matrix
    multiply(matrix) {
      return this.clone().multiplyO(matrix);
    }
    multiplyO(matrix) {
      const l = this;
      const r = matrix instanceof _Matrix ? matrix : new _Matrix(matrix);
      return _Matrix.matrixMultiply(l, r, this);
    }
    // Rotate matrix
    rotate(r, cx3, cy3) {
      return this.clone().rotateO(r, cx3, cy3);
    }
    rotateO(r, cx3 = 0, cy3 = 0) {
      r = radians(r);
      const cos = Math.cos(r);
      const sin = Math.sin(r);
      const { a, b, c, d, e, f } = this;
      this.a = a * cos - b * sin;
      this.b = b * cos + a * sin;
      this.c = c * cos - d * sin;
      this.d = d * cos + c * sin;
      this.e = e * cos - f * sin + cy3 * sin - cx3 * cos + cx3;
      this.f = f * cos + e * sin - cx3 * sin - cy3 * cos + cy3;
      return this;
    }
    // Scale matrix
    scale() {
      return this.clone().scaleO(...arguments);
    }
    scaleO(x5, y5 = x5, cx3 = 0, cy3 = 0) {
      if (arguments.length === 3) {
        cy3 = cx3;
        cx3 = y5;
        y5 = x5;
      }
      const { a, b, c, d, e, f } = this;
      this.a = a * x5;
      this.b = b * y5;
      this.c = c * x5;
      this.d = d * y5;
      this.e = e * x5 - cx3 * x5 + cx3;
      this.f = f * y5 - cy3 * y5 + cy3;
      return this;
    }
    // Shear matrix
    shear(a, cx3, cy3) {
      return this.clone().shearO(a, cx3, cy3);
    }
    // eslint-disable-next-line no-unused-vars
    shearO(lx, cx3 = 0, cy3 = 0) {
      const { a, b, c, d, e, f } = this;
      this.a = a + b * lx;
      this.c = c + d * lx;
      this.e = e + f * lx - cy3 * lx;
      return this;
    }
    // Skew Matrix
    skew() {
      return this.clone().skewO(...arguments);
    }
    skewO(x5, y5 = x5, cx3 = 0, cy3 = 0) {
      if (arguments.length === 3) {
        cy3 = cx3;
        cx3 = y5;
        y5 = x5;
      }
      x5 = radians(x5);
      y5 = radians(y5);
      const lx = Math.tan(x5);
      const ly = Math.tan(y5);
      const { a, b, c, d, e, f } = this;
      this.a = a + b * lx;
      this.b = b + a * ly;
      this.c = c + d * lx;
      this.d = d + c * ly;
      this.e = e + f * lx - cy3 * lx;
      this.f = f + e * ly - cx3 * ly;
      return this;
    }
    // SkewX
    skewX(x5, cx3, cy3) {
      return this.skew(x5, 0, cx3, cy3);
    }
    // SkewY
    skewY(y5, cx3, cy3) {
      return this.skew(0, y5, cx3, cy3);
    }
    toArray() {
      return [this.a, this.b, this.c, this.d, this.e, this.f];
    }
    // Convert matrix to string
    toString() {
      return "matrix(" + this.a + "," + this.b + "," + this.c + "," + this.d + "," + this.e + "," + this.f + ")";
    }
    // Transform a matrix into another matrix by manipulating the space
    transform(o) {
      if (_Matrix.isMatrixLike(o)) {
        const matrix = new _Matrix(o);
        return matrix.multiplyO(this);
      }
      const t = _Matrix.formatTransforms(o);
      const current = this;
      const { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current);
      const transformer = new _Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy);
      if (isFinite(t.px) || isFinite(t.py)) {
        const origin = new Point(ox, oy).transform(transformer);
        const dx2 = isFinite(t.px) ? t.px - origin.x : 0;
        const dy2 = isFinite(t.py) ? t.py - origin.y : 0;
        transformer.translateO(dx2, dy2);
      }
      transformer.translateO(t.tx, t.ty);
      return transformer;
    }
    // Translate matrix
    translate(x5, y5) {
      return this.clone().translateO(x5, y5);
    }
    translateO(x5, y5) {
      this.e += x5 || 0;
      this.f += y5 || 0;
      return this;
    }
    valueOf() {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      };
    }
  };
  function ctm() {
    return new Matrix(this.node.getCTM());
  }
  function screenCTM() {
    try {
      if (typeof this.isRoot === "function" && !this.isRoot()) {
        const rect = this.rect(1, 1);
        const m = rect.node.getScreenCTM();
        rect.remove();
        return new Matrix(m);
      }
      return new Matrix(this.node.getScreenCTM());
    } catch (e) {
      console.warn(
        `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
      );
      return new Matrix();
    }
  }
  register(Matrix, "Matrix");

  // node_modules/@svgdotjs/svg.js/src/modules/core/parser.js
  function parser() {
    if (!parser.nodes) {
      const svg2 = makeInstance().size(2, 0);
      svg2.node.style.cssText = [
        "opacity: 0",
        "position: absolute",
        "left: -100%",
        "top: -100%",
        "overflow: hidden"
      ].join(";");
      svg2.attr("focusable", "false");
      svg2.attr("aria-hidden", "true");
      const path = svg2.path().node;
      parser.nodes = { svg: svg2, path };
    }
    if (!parser.nodes.svg.node.parentNode) {
      const b = globals.document.body || globals.document.documentElement;
      parser.nodes.svg.addTo(b);
    }
    return parser.nodes;
  }

  // node_modules/@svgdotjs/svg.js/src/types/Box.js
  function isNulledBox(box) {
    return !box.width && !box.height && !box.x && !box.y;
  }
  function domContains(node) {
    return node === globals.document || (globals.document.documentElement.contains || function(node2) {
      while (node2.parentNode) {
        node2 = node2.parentNode;
      }
      return node2 === globals.document;
    }).call(globals.document.documentElement, node);
  }
  var Box = class _Box {
    constructor(...args) {
      this.init(...args);
    }
    addOffset() {
      this.x += globals.window.pageXOffset;
      this.y += globals.window.pageYOffset;
      return new _Box(this);
    }
    init(source) {
      const base = [0, 0, 0, 0];
      source = typeof source === "string" ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : typeof source === "object" ? [
        source.left != null ? source.left : source.x,
        source.top != null ? source.top : source.y,
        source.width,
        source.height
      ] : arguments.length === 4 ? [].slice.call(arguments) : base;
      this.x = source[0] || 0;
      this.y = source[1] || 0;
      this.width = this.w = source[2] || 0;
      this.height = this.h = source[3] || 0;
      this.x2 = this.x + this.w;
      this.y2 = this.y + this.h;
      this.cx = this.x + this.w / 2;
      this.cy = this.y + this.h / 2;
      return this;
    }
    isNulled() {
      return isNulledBox(this);
    }
    // Merge rect box with another, return a new instance
    merge(box) {
      const x5 = Math.min(this.x, box.x);
      const y5 = Math.min(this.y, box.y);
      const width4 = Math.max(this.x + this.width, box.x + box.width) - x5;
      const height4 = Math.max(this.y + this.height, box.y + box.height) - y5;
      return new _Box(x5, y5, width4, height4);
    }
    toArray() {
      return [this.x, this.y, this.width, this.height];
    }
    toString() {
      return this.x + " " + this.y + " " + this.width + " " + this.height;
    }
    transform(m) {
      if (!(m instanceof Matrix)) {
        m = new Matrix(m);
      }
      let xMin = Infinity;
      let xMax = -Infinity;
      let yMin = Infinity;
      let yMax = -Infinity;
      const pts = [
        new Point(this.x, this.y),
        new Point(this.x2, this.y),
        new Point(this.x, this.y2),
        new Point(this.x2, this.y2)
      ];
      pts.forEach(function(p) {
        p = p.transform(m);
        xMin = Math.min(xMin, p.x);
        xMax = Math.max(xMax, p.x);
        yMin = Math.min(yMin, p.y);
        yMax = Math.max(yMax, p.y);
      });
      return new _Box(xMin, yMin, xMax - xMin, yMax - yMin);
    }
  };
  function getBox(el, getBBoxFn, retry) {
    let box;
    try {
      box = getBBoxFn(el.node);
      if (isNulledBox(box) && !domContains(el.node)) {
        throw new Error("Element not in the dom");
      }
    } catch (e) {
      box = retry(el);
    }
    return box;
  }
  function bbox() {
    const getBBox = (node) => node.getBBox();
    const retry = (el) => {
      try {
        const clone = el.clone().addTo(parser().svg).show();
        const box2 = clone.node.getBBox();
        clone.remove();
        return box2;
      } catch (e) {
        throw new Error(
          `Getting bbox of element "${el.node.nodeName}" is not possible: ${e.toString()}`
        );
      }
    };
    const box = getBox(this, getBBox, retry);
    const bbox2 = new Box(box);
    return bbox2;
  }
  function rbox(el) {
    const getRBox = (node) => node.getBoundingClientRect();
    const retry = (el2) => {
      throw new Error(
        `Getting rbox of element "${el2.node.nodeName}" is not possible`
      );
    };
    const box = getBox(this, getRBox, retry);
    const rbox2 = new Box(box);
    if (el) {
      return rbox2.transform(el.screenCTM().inverseO());
    }
    return rbox2.addOffset();
  }
  function inside(x5, y5) {
    const box = this.bbox();
    return x5 > box.x && y5 > box.y && x5 < box.x + box.width && y5 < box.y + box.height;
  }
  registerMethods({
    viewbox: {
      viewbox(x5, y5, width4, height4) {
        if (x5 == null) return new Box(this.attr("viewBox"));
        return this.attr("viewBox", new Box(x5, y5, width4, height4));
      },
      zoom(level, point2) {
        let { width: width4, height: height4 } = this.attr(["width", "height"]);
        if (!width4 && !height4 || typeof width4 === "string" || typeof height4 === "string") {
          width4 = this.node.clientWidth;
          height4 = this.node.clientHeight;
        }
        if (!width4 || !height4) {
          throw new Error(
            "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
          );
        }
        const v = this.viewbox();
        const zoomX = width4 / v.width;
        const zoomY = height4 / v.height;
        const zoom = Math.min(zoomX, zoomY);
        if (level == null) {
          return zoom;
        }
        let zoomAmount = zoom / level;
        if (zoomAmount === Infinity) zoomAmount = Number.MAX_SAFE_INTEGER / 100;
        point2 = point2 || new Point(width4 / 2 / zoomX + v.x, height4 / 2 / zoomY + v.y);
        const box = new Box(v).transform(
          new Matrix({ scale: zoomAmount, origin: point2 })
        );
        return this.viewbox(box);
      }
    }
  });
  register(Box, "Box");

  // node_modules/@svgdotjs/svg.js/src/types/List.js
  var List = class extends Array {
    constructor(arr = [], ...args) {
      super(arr, ...args);
      if (typeof arr === "number") return this;
      this.length = 0;
      this.push(...arr);
    }
  };
  var List_default = List;
  extend([List], {
    each(fnOrMethodName, ...args) {
      if (typeof fnOrMethodName === "function") {
        return this.map((el, i, arr) => {
          return fnOrMethodName.call(el, el, i, arr);
        });
      } else {
        return this.map((el) => {
          return el[fnOrMethodName](...args);
        });
      }
    },
    toArray() {
      return Array.prototype.concat.apply([], this);
    }
  });
  var reserved = ["toArray", "constructor", "each"];
  List.extend = function(methods3) {
    methods3 = methods3.reduce((obj, name) => {
      if (reserved.includes(name)) return obj;
      if (name[0] === "_") return obj;
      if (name in Array.prototype) {
        obj["$" + name] = Array.prototype[name];
      }
      obj[name] = function(...attrs2) {
        return this.each(name, ...attrs2);
      };
      return obj;
    }, {});
    extend([List], methods3);
  };

  // node_modules/@svgdotjs/svg.js/src/modules/core/selector.js
  function baseFind(query, parent) {
    return new List_default(
      map((parent || globals.document).querySelectorAll(query), function(node) {
        return adopt(node);
      })
    );
  }
  function find(query) {
    return baseFind(query, this.node);
  }
  function findOne(query) {
    return adopt(this.node.querySelector(query));
  }

  // node_modules/@svgdotjs/svg.js/src/modules/core/event.js
  var listenerId = 0;
  var windowEvents = {};
  function getEvents(instance) {
    let n = instance.getEventHolder();
    if (n === globals.window) n = windowEvents;
    if (!n.events) n.events = {};
    return n.events;
  }
  function getEventTarget(instance) {
    return instance.getEventTarget();
  }
  function clearEvents(instance) {
    let n = instance.getEventHolder();
    if (n === globals.window) n = windowEvents;
    if (n.events) n.events = {};
  }
  function on2(node, events, listener, binding, options) {
    const l = listener.bind(binding || node);
    const instance = makeInstance(node);
    const bag = getEvents(instance);
    const n = getEventTarget(instance);
    events = Array.isArray(events) ? events : events.split(delimiter);
    if (!listener._svgjsListenerId) {
      listener._svgjsListenerId = ++listenerId;
    }
    events.forEach(function(event) {
      const ev = event.split(".")[0];
      const ns = event.split(".")[1] || "*";
      bag[ev] = bag[ev] || {};
      bag[ev][ns] = bag[ev][ns] || {};
      bag[ev][ns][listener._svgjsListenerId] = l;
      n.addEventListener(ev, l, options || false);
    });
  }
  function off(node, events, listener, options) {
    const instance = makeInstance(node);
    const bag = getEvents(instance);
    const n = getEventTarget(instance);
    if (typeof listener === "function") {
      listener = listener._svgjsListenerId;
      if (!listener) return;
    }
    events = Array.isArray(events) ? events : (events || "").split(delimiter);
    events.forEach(function(event) {
      const ev = event && event.split(".")[0];
      const ns = event && event.split(".")[1];
      let namespace, l;
      if (listener) {
        if (bag[ev] && bag[ev][ns || "*"]) {
          n.removeEventListener(
            ev,
            bag[ev][ns || "*"][listener],
            options || false
          );
          delete bag[ev][ns || "*"][listener];
        }
      } else if (ev && ns) {
        if (bag[ev] && bag[ev][ns]) {
          for (l in bag[ev][ns]) {
            off(n, [ev, ns].join("."), l);
          }
          delete bag[ev][ns];
        }
      } else if (ns) {
        for (event in bag) {
          for (namespace in bag[event]) {
            if (ns === namespace) {
              off(n, [event, ns].join("."));
            }
          }
        }
      } else if (ev) {
        if (bag[ev]) {
          for (namespace in bag[ev]) {
            off(n, [ev, namespace].join("."));
          }
          delete bag[ev];
        }
      } else {
        for (event in bag) {
          off(n, event);
        }
        clearEvents(instance);
      }
    });
  }
  function dispatch(node, event, data2, options) {
    const n = getEventTarget(node);
    if (event instanceof globals.window.Event) {
      n.dispatchEvent(event);
    } else {
      event = new globals.window.CustomEvent(event, {
        detail: data2,
        cancelable: true,
        ...options
      });
      n.dispatchEvent(event);
    }
    return event;
  }

  // node_modules/@svgdotjs/svg.js/src/types/EventTarget.js
  var EventTarget = class extends Base {
    addEventListener() {
    }
    dispatch(event, data2, options) {
      return dispatch(this, event, data2, options);
    }
    dispatchEvent(event) {
      const bag = this.getEventHolder().events;
      if (!bag) return true;
      const events = bag[event.type];
      for (const i in events) {
        for (const j in events[i]) {
          events[i][j](event);
        }
      }
      return !event.defaultPrevented;
    }
    // Fire given event
    fire(event, data2, options) {
      this.dispatch(event, data2, options);
      return this;
    }
    getEventHolder() {
      return this;
    }
    getEventTarget() {
      return this;
    }
    // Unbind event from listener
    off(event, listener, options) {
      off(this, event, listener, options);
      return this;
    }
    // Bind given event to listener
    on(event, listener, binding, options) {
      on2(this, event, listener, binding, options);
      return this;
    }
    removeEventListener() {
    }
  };
  register(EventTarget, "EventTarget");

  // node_modules/@svgdotjs/svg.js/src/modules/core/defaults.js
  function noop() {
  }
  var timeline = {
    duration: 400,
    ease: ">",
    delay: 0
  };
  var attrs = {
    // fill and stroke
    "fill-opacity": 1,
    "stroke-opacity": 1,
    "stroke-width": 0,
    "stroke-linejoin": "miter",
    "stroke-linecap": "butt",
    fill: "#000000",
    stroke: "#000000",
    opacity: 1,
    // position
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    // size
    width: 0,
    height: 0,
    // radius
    r: 0,
    rx: 0,
    ry: 0,
    // gradient
    offset: 0,
    "stop-opacity": 1,
    "stop-color": "#000000",
    // text
    "text-anchor": "start"
  };

  // node_modules/@svgdotjs/svg.js/src/types/SVGArray.js
  var SVGArray = class extends Array {
    constructor(...args) {
      super(...args);
      this.init(...args);
    }
    clone() {
      return new this.constructor(this);
    }
    init(arr) {
      if (typeof arr === "number") return this;
      this.length = 0;
      this.push(...this.parse(arr));
      return this;
    }
    // Parse whitespace separated string
    parse(array2 = []) {
      if (array2 instanceof Array) return array2;
      return array2.trim().split(delimiter).map(parseFloat);
    }
    toArray() {
      return Array.prototype.concat.apply([], this);
    }
    toSet() {
      return new Set(this);
    }
    toString() {
      return this.join(" ");
    }
    // Flattens the array if needed
    valueOf() {
      const ret = [];
      ret.push(...this);
      return ret;
    }
  };

  // node_modules/@svgdotjs/svg.js/src/types/SVGNumber.js
  var SVGNumber = class _SVGNumber {
    // Initialize
    constructor(...args) {
      this.init(...args);
    }
    convert(unit) {
      return new _SVGNumber(this.value, unit);
    }
    // Divide number
    divide(number) {
      number = new _SVGNumber(number);
      return new _SVGNumber(this / number, this.unit || number.unit);
    }
    init(value, unit) {
      unit = Array.isArray(value) ? value[1] : unit;
      value = Array.isArray(value) ? value[0] : value;
      this.value = 0;
      this.unit = unit || "";
      if (typeof value === "number") {
        this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -34e37 : 34e37 : value;
      } else if (typeof value === "string") {
        unit = value.match(numberAndUnit);
        if (unit) {
          this.value = parseFloat(unit[1]);
          if (unit[5] === "%") {
            this.value /= 100;
          } else if (unit[5] === "s") {
            this.value *= 1e3;
          }
          this.unit = unit[5];
        }
      } else {
        if (value instanceof _SVGNumber) {
          this.value = value.valueOf();
          this.unit = value.unit;
        }
      }
      return this;
    }
    // Subtract number
    minus(number) {
      number = new _SVGNumber(number);
      return new _SVGNumber(this - number, this.unit || number.unit);
    }
    // Add number
    plus(number) {
      number = new _SVGNumber(number);
      return new _SVGNumber(this + number, this.unit || number.unit);
    }
    // Multiply number
    times(number) {
      number = new _SVGNumber(number);
      return new _SVGNumber(this * number, this.unit || number.unit);
    }
    toArray() {
      return [this.value, this.unit];
    }
    toJSON() {
      return this.toString();
    }
    toString() {
      return (this.unit === "%" ? ~~(this.value * 1e8) / 1e6 : this.unit === "s" ? this.value / 1e3 : this.value) + this.unit;
    }
    valueOf() {
      return this.value;
    }
  };

  // node_modules/@svgdotjs/svg.js/src/modules/core/attr.js
  var colorAttributes = /* @__PURE__ */ new Set([
    "fill",
    "stroke",
    "color",
    "bgcolor",
    "stop-color",
    "flood-color",
    "lighting-color"
  ]);
  var hooks = [];
  function registerAttrHook(fn) {
    hooks.push(fn);
  }
  function attr(attr2, val, ns) {
    if (attr2 == null) {
      attr2 = {};
      val = this.node.attributes;
      for (const node of val) {
        attr2[node.nodeName] = isNumber.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
      }
      return attr2;
    } else if (attr2 instanceof Array) {
      return attr2.reduce((last, curr) => {
        last[curr] = this.attr(curr);
        return last;
      }, {});
    } else if (typeof attr2 === "object" && attr2.constructor === Object) {
      for (val in attr2) this.attr(val, attr2[val]);
    } else if (val === null) {
      this.node.removeAttribute(attr2);
    } else if (val == null) {
      val = this.node.getAttribute(attr2);
      return val == null ? attrs[attr2] : isNumber.test(val) ? parseFloat(val) : val;
    } else {
      val = hooks.reduce((_val, hook) => {
        return hook(attr2, _val, this);
      }, val);
      if (typeof val === "number") {
        val = new SVGNumber(val);
      } else if (colorAttributes.has(attr2) && Color.isColor(val)) {
        val = new Color(val);
      } else if (val.constructor === Array) {
        val = new SVGArray(val);
      }
      if (attr2 === "leading") {
        if (this.leading) {
          this.leading(val);
        }
      } else {
        typeof ns === "string" ? this.node.setAttributeNS(ns, attr2, val.toString()) : this.node.setAttribute(attr2, val.toString());
      }
      if (this.rebuild && (attr2 === "font-size" || attr2 === "x")) {
        this.rebuild();
      }
    }
    return this;
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Dom.js
  var Dom = class _Dom extends EventTarget {
    constructor(node, attrs2) {
      super();
      this.node = node;
      this.type = node.nodeName;
      if (attrs2 && node !== attrs2) {
        this.attr(attrs2);
      }
    }
    // Add given element at a position
    add(element, i) {
      element = makeInstance(element);
      if (element.removeNamespace && this.node instanceof globals.window.SVGElement) {
        element.removeNamespace();
      }
      if (i == null) {
        this.node.appendChild(element.node);
      } else if (element.node !== this.node.childNodes[i]) {
        this.node.insertBefore(element.node, this.node.childNodes[i]);
      }
      return this;
    }
    // Add element to given container and return self
    addTo(parent, i) {
      return makeInstance(parent).put(this, i);
    }
    // Returns all child elements
    children() {
      return new List_default(
        map(this.node.children, function(node) {
          return adopt(node);
        })
      );
    }
    // Remove all elements in this container
    clear() {
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      }
      return this;
    }
    // Clone element
    clone(deep = true, assignNewIds = true) {
      this.writeDataToDom();
      let nodeClone = this.node.cloneNode(deep);
      if (assignNewIds) {
        nodeClone = assignNewId(nodeClone);
      }
      return new this.constructor(nodeClone);
    }
    // Iterates over all children and invokes a given block
    each(block, deep) {
      const children = this.children();
      let i, il;
      for (i = 0, il = children.length; i < il; i++) {
        block.apply(children[i], [i, children]);
        if (deep) {
          children[i].each(block, deep);
        }
      }
      return this;
    }
    element(nodeName, attrs2) {
      return this.put(new _Dom(create(nodeName), attrs2));
    }
    // Get first child
    first() {
      return adopt(this.node.firstChild);
    }
    // Get a element at the given index
    get(i) {
      return adopt(this.node.childNodes[i]);
    }
    getEventHolder() {
      return this.node;
    }
    getEventTarget() {
      return this.node;
    }
    // Checks if the given element is a child
    has(element) {
      return this.index(element) >= 0;
    }
    html(htmlOrFn, outerHTML) {
      return this.xml(htmlOrFn, outerHTML, html);
    }
    // Get / set id
    id(id) {
      if (typeof id === "undefined" && !this.node.id) {
        this.node.id = eid(this.type);
      }
      return this.attr("id", id);
    }
    // Gets index of given element
    index(element) {
      return [].slice.call(this.node.childNodes).indexOf(element.node);
    }
    // Get the last child
    last() {
      return adopt(this.node.lastChild);
    }
    // matches the element vs a css selector
    matches(selector) {
      const el = this.node;
      const matcher = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector || null;
      return matcher && matcher.call(el, selector);
    }
    // Returns the parent element instance
    parent(type) {
      let parent = this;
      if (!parent.node.parentNode) return null;
      parent = adopt(parent.node.parentNode);
      if (!type) return parent;
      do {
        if (typeof type === "string" ? parent.matches(type) : parent instanceof type)
          return parent;
      } while (parent = adopt(parent.node.parentNode));
      return parent;
    }
    // Basically does the same as `add()` but returns the added element instead
    put(element, i) {
      element = makeInstance(element);
      this.add(element, i);
      return element;
    }
    // Add element to given container and return container
    putIn(parent, i) {
      return makeInstance(parent).add(this, i);
    }
    // Remove element
    remove() {
      if (this.parent()) {
        this.parent().removeElement(this);
      }
      return this;
    }
    // Remove a given child
    removeElement(element) {
      this.node.removeChild(element.node);
      return this;
    }
    // Replace this with element
    replace(element) {
      element = makeInstance(element);
      if (this.node.parentNode) {
        this.node.parentNode.replaceChild(element.node, this.node);
      }
      return element;
    }
    round(precision = 2, map2 = null) {
      const factor = 10 ** precision;
      const attrs2 = this.attr(map2);
      for (const i in attrs2) {
        if (typeof attrs2[i] === "number") {
          attrs2[i] = Math.round(attrs2[i] * factor) / factor;
        }
      }
      this.attr(attrs2);
      return this;
    }
    // Import / Export raw svg
    svg(svgOrFn, outerSVG) {
      return this.xml(svgOrFn, outerSVG, svg);
    }
    // Return id on string conversion
    toString() {
      return this.id();
    }
    words(text) {
      this.node.textContent = text;
      return this;
    }
    wrap(node) {
      const parent = this.parent();
      if (!parent) {
        return this.addTo(node);
      }
      const position2 = parent.index(this);
      return parent.put(node, position2).put(this);
    }
    // write svgjs data to the dom
    writeDataToDom() {
      this.each(function() {
        this.writeDataToDom();
      });
      return this;
    }
    // Import / Export raw svg
    xml(xmlOrFn, outerXML, ns) {
      if (typeof xmlOrFn === "boolean") {
        ns = outerXML;
        outerXML = xmlOrFn;
        xmlOrFn = null;
      }
      if (xmlOrFn == null || typeof xmlOrFn === "function") {
        outerXML = outerXML == null ? true : outerXML;
        this.writeDataToDom();
        let current = this;
        if (xmlOrFn != null) {
          current = adopt(current.node.cloneNode(true));
          if (outerXML) {
            const result = xmlOrFn(current);
            current = result || current;
            if (result === false) return "";
          }
          current.each(function() {
            const result = xmlOrFn(this);
            const _this = result || this;
            if (result === false) {
              this.remove();
            } else if (result && this !== _this) {
              this.replace(_this);
            }
          }, true);
        }
        return outerXML ? current.node.outerHTML : current.node.innerHTML;
      }
      outerXML = outerXML == null ? false : outerXML;
      const well = create("wrapper", ns);
      const fragment = globals.document.createDocumentFragment();
      well.innerHTML = xmlOrFn;
      for (let len = well.children.length; len--; ) {
        fragment.appendChild(well.firstElementChild);
      }
      const parent = this.parent();
      return outerXML ? this.replace(fragment) && parent : this.add(fragment);
    }
  };
  extend(Dom, { attr, find, findOne });
  register(Dom, "Dom");

  // node_modules/@svgdotjs/svg.js/src/elements/Element.js
  var Element = class extends Dom {
    constructor(node, attrs2) {
      super(node, attrs2);
      this.dom = {};
      this.node.instance = this;
      if (node.hasAttribute("data-svgjs") || node.hasAttribute("svgjs:data")) {
        this.setData(
          JSON.parse(node.getAttribute("data-svgjs")) ?? JSON.parse(node.getAttribute("svgjs:data")) ?? {}
        );
      }
    }
    // Move element by its center
    center(x5, y5) {
      return this.cx(x5).cy(y5);
    }
    // Move by center over x-axis
    cx(x5) {
      return x5 == null ? this.x() + this.width() / 2 : this.x(x5 - this.width() / 2);
    }
    // Move by center over y-axis
    cy(y5) {
      return y5 == null ? this.y() + this.height() / 2 : this.y(y5 - this.height() / 2);
    }
    // Get defs
    defs() {
      const root2 = this.root();
      return root2 && root2.defs();
    }
    // Relative move over x and y axes
    dmove(x5, y5) {
      return this.dx(x5).dy(y5);
    }
    // Relative move over x axis
    dx(x5 = 0) {
      return this.x(new SVGNumber(x5).plus(this.x()));
    }
    // Relative move over y axis
    dy(y5 = 0) {
      return this.y(new SVGNumber(y5).plus(this.y()));
    }
    getEventHolder() {
      return this;
    }
    // Set height of element
    height(height4) {
      return this.attr("height", height4);
    }
    // Move element to given x and y values
    move(x5, y5) {
      return this.x(x5).y(y5);
    }
    // return array of all ancestors of given type up to the root svg
    parents(until = this.root()) {
      const isSelector = typeof until === "string";
      if (!isSelector) {
        until = makeInstance(until);
      }
      const parents = new List_default();
      let parent = this;
      while ((parent = parent.parent()) && parent.node !== globals.document && parent.nodeName !== "#document-fragment") {
        parents.push(parent);
        if (!isSelector && parent.node === until.node) {
          break;
        }
        if (isSelector && parent.matches(until)) {
          break;
        }
        if (parent.node === this.root().node) {
          return null;
        }
      }
      return parents;
    }
    // Get referenced element form attribute value
    reference(attr2) {
      attr2 = this.attr(attr2);
      if (!attr2) return null;
      const m = (attr2 + "").match(reference);
      return m ? makeInstance(m[1]) : null;
    }
    // Get parent document
    root() {
      const p = this.parent(getClass(root));
      return p && p.root();
    }
    // set given data to the elements data property
    setData(o) {
      this.dom = o;
      return this;
    }
    // Set element size to given width and height
    size(width4, height4) {
      const p = proportionalSize(this, width4, height4);
      return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
    }
    // Set width of element
    width(width4) {
      return this.attr("width", width4);
    }
    // write svgjs data to the dom
    writeDataToDom() {
      writeDataToDom(this, this.dom);
      return super.writeDataToDom();
    }
    // Move over x-axis
    x(x5) {
      return this.attr("x", x5);
    }
    // Move over y-axis
    y(y5) {
      return this.attr("y", y5);
    }
  };
  extend(Element, {
    bbox,
    rbox,
    inside,
    point,
    ctm,
    screenCTM
  });
  register(Element, "Element");

  // node_modules/@svgdotjs/svg.js/src/modules/optional/sugar.js
  var sugar = {
    stroke: [
      "color",
      "width",
      "opacity",
      "linecap",
      "linejoin",
      "miterlimit",
      "dasharray",
      "dashoffset"
    ],
    fill: ["color", "opacity", "rule"],
    prefix: function(t, a) {
      return a === "color" ? t : t + "-" + a;
    }
  };
  ["fill", "stroke"].forEach(function(m) {
    const extension = {};
    let i;
    extension[m] = function(o) {
      if (typeof o === "undefined") {
        return this.attr(m);
      }
      if (typeof o === "string" || o instanceof Color || Color.isRgb(o) || o instanceof Element) {
        this.attr(m, o);
      } else {
        for (i = sugar[m].length - 1; i >= 0; i--) {
          if (o[sugar[m][i]] != null) {
            this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
          }
        }
      }
      return this;
    };
    registerMethods(["Element", "Runner"], extension);
  });
  registerMethods(["Element", "Runner"], {
    // Let the user set the matrix directly
    matrix: function(mat, b, c, d, e, f) {
      if (mat == null) {
        return new Matrix(this);
      }
      return this.attr("transform", new Matrix(mat, b, c, d, e, f));
    },
    // Map rotation to transform
    rotate: function(angle, cx3, cy3) {
      return this.transform({ rotate: angle, ox: cx3, oy: cy3 }, true);
    },
    // Map skew to transform
    skew: function(x5, y5, cx3, cy3) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({ skew: x5, ox: y5, oy: cx3 }, true) : this.transform({ skew: [x5, y5], ox: cx3, oy: cy3 }, true);
    },
    shear: function(lam, cx3, cy3) {
      return this.transform({ shear: lam, ox: cx3, oy: cy3 }, true);
    },
    // Map scale to transform
    scale: function(x5, y5, cx3, cy3) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({ scale: x5, ox: y5, oy: cx3 }, true) : this.transform({ scale: [x5, y5], ox: cx3, oy: cy3 }, true);
    },
    // Map translate to transform
    translate: function(x5, y5) {
      return this.transform({ translate: [x5, y5] }, true);
    },
    // Map relative translations to transform
    relative: function(x5, y5) {
      return this.transform({ relative: [x5, y5] }, true);
    },
    // Map flip to transform
    flip: function(direction = "both", origin = "center") {
      if ("xybothtrue".indexOf(direction) === -1) {
        origin = direction;
        direction = "both";
      }
      return this.transform({ flip: direction, origin }, true);
    },
    // Opacity
    opacity: function(value) {
      return this.attr("opacity", value);
    }
  });
  registerMethods("radius", {
    // Add x and y radius
    radius: function(x5, y5 = x5) {
      const type = (this._element || this).type;
      return type === "radialGradient" ? this.attr("r", new SVGNumber(x5)) : this.rx(x5).ry(y5);
    }
  });
  registerMethods("Path", {
    // Get path length
    length: function() {
      return this.node.getTotalLength();
    },
    // Get point at length
    pointAt: function(length2) {
      return new Point(this.node.getPointAtLength(length2));
    }
  });
  registerMethods(["Element", "Runner"], {
    // Set font
    font: function(a, v) {
      if (typeof a === "object") {
        for (v in a) this.font(v, a[v]);
        return this;
      }
      return a === "leading" ? this.leading(v) : a === "anchor" ? this.attr("text-anchor", v) : a === "size" || a === "family" || a === "weight" || a === "stretch" || a === "variant" || a === "style" ? this.attr("font-" + a, v) : this.attr(a, v);
    }
  });
  var methods2 = [
    "click",
    "dblclick",
    "mousedown",
    "mouseup",
    "mouseover",
    "mouseout",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "touchstart",
    "touchmove",
    "touchleave",
    "touchend",
    "touchcancel",
    "contextmenu",
    "wheel",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointerleave",
    "pointercancel"
  ].reduce(function(last, event) {
    const fn = function(f) {
      if (f === null) {
        this.off(event);
      } else {
        this.on(event, f);
      }
      return this;
    };
    last[event] = fn;
    return last;
  }, {});
  registerMethods("Element", methods2);

  // node_modules/@svgdotjs/svg.js/src/modules/optional/transform.js
  function untransform() {
    return this.attr("transform", null);
  }
  function matrixify() {
    const matrix = (this.attr("transform") || "").split(transforms).slice(0, -1).map(function(str) {
      const kv = str.trim().split("(");
      return [
        kv[0],
        kv[1].split(delimiter).map(function(str2) {
          return parseFloat(str2);
        })
      ];
    }).reverse().reduce(function(matrix2, transform2) {
      if (transform2[0] === "matrix") {
        return matrix2.lmultiply(Matrix.fromArray(transform2[1]));
      }
      return matrix2[transform2[0]].apply(matrix2, transform2[1]);
    }, new Matrix());
    return matrix;
  }
  function toParent(parent, i) {
    if (this === parent) return this;
    if (isDescriptive(this.node)) return this.addTo(parent, i);
    const ctm2 = this.screenCTM();
    const pCtm = parent.screenCTM().inverse();
    this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm2));
    return this;
  }
  function toRoot(i) {
    return this.toParent(this.root(), i);
  }
  function transform(o, relative) {
    if (o == null || typeof o === "string") {
      const decomposed = new Matrix(this).decompose();
      return o == null ? decomposed : decomposed[o];
    }
    if (!Matrix.isMatrixLike(o)) {
      o = { ...o, origin: getOrigin(o, this) };
    }
    const cleanRelative = relative === true ? this : relative || false;
    const result = new Matrix(cleanRelative).transform(o);
    return this.attr("transform", result);
  }
  registerMethods("Element", {
    untransform,
    matrixify,
    toParent,
    toRoot,
    transform
  });

  // node_modules/@svgdotjs/svg.js/src/elements/Container.js
  var Container = class _Container extends Element {
    flatten() {
      this.each(function() {
        if (this instanceof _Container) {
          return this.flatten().ungroup();
        }
      });
      return this;
    }
    ungroup(parent = this.parent(), index = parent.index(this)) {
      index = index === -1 ? parent.children().length : index;
      this.each(function(i, children) {
        return children[children.length - i - 1].toParent(parent, index);
      });
      return this.remove();
    }
  };
  register(Container, "Container");

  // node_modules/@svgdotjs/svg.js/src/elements/Defs.js
  var Defs = class extends Container {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("defs", node), attrs2);
    }
    flatten() {
      return this;
    }
    ungroup() {
      return this;
    }
  };
  register(Defs, "Defs");

  // node_modules/@svgdotjs/svg.js/src/elements/Shape.js
  var Shape = class extends Element {
  };
  register(Shape, "Shape");

  // node_modules/@svgdotjs/svg.js/src/modules/core/circled.js
  var circled_exports = {};
  __export(circled_exports, {
    cx: () => cx,
    cy: () => cy,
    height: () => height,
    rx: () => rx,
    ry: () => ry,
    width: () => width,
    x: () => x,
    y: () => y
  });
  function rx(rx2) {
    return this.attr("rx", rx2);
  }
  function ry(ry2) {
    return this.attr("ry", ry2);
  }
  function x(x5) {
    return x5 == null ? this.cx() - this.rx() : this.cx(x5 + this.rx());
  }
  function y(y5) {
    return y5 == null ? this.cy() - this.ry() : this.cy(y5 + this.ry());
  }
  function cx(x5) {
    return this.attr("cx", x5);
  }
  function cy(y5) {
    return this.attr("cy", y5);
  }
  function width(width4) {
    return width4 == null ? this.rx() * 2 : this.rx(new SVGNumber(width4).divide(2));
  }
  function height(height4) {
    return height4 == null ? this.ry() * 2 : this.ry(new SVGNumber(height4).divide(2));
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Ellipse.js
  var Ellipse = class extends Shape {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("ellipse", node), attrs2);
    }
    size(width4, height4) {
      const p = proportionalSize(this, width4, height4);
      return this.rx(new SVGNumber(p.width).divide(2)).ry(
        new SVGNumber(p.height).divide(2)
      );
    }
  };
  extend(Ellipse, circled_exports);
  registerMethods("Container", {
    // Create an ellipse
    ellipse: wrapWithAttrCheck(function(width4 = 0, height4 = width4) {
      return this.put(new Ellipse()).size(width4, height4).move(0, 0);
    })
  });
  register(Ellipse, "Ellipse");

  // node_modules/@svgdotjs/svg.js/src/elements/Fragment.js
  var Fragment = class extends Dom {
    constructor(node = globals.document.createDocumentFragment()) {
      super(node);
    }
    // Import / Export raw xml
    xml(xmlOrFn, outerXML, ns) {
      if (typeof xmlOrFn === "boolean") {
        ns = outerXML;
        outerXML = xmlOrFn;
        xmlOrFn = null;
      }
      if (xmlOrFn == null || typeof xmlOrFn === "function") {
        const wrapper = new Dom(create("wrapper", ns));
        wrapper.add(this.node.cloneNode(true));
        return wrapper.xml(false, ns);
      }
      return super.xml(xmlOrFn, false, ns);
    }
  };
  register(Fragment, "Fragment");
  var Fragment_default = Fragment;

  // node_modules/@svgdotjs/svg.js/src/modules/core/gradiented.js
  var gradiented_exports = {};
  __export(gradiented_exports, {
    from: () => from,
    to: () => to
  });
  function from(x5, y5) {
    return (this._element || this).type === "radialGradient" ? this.attr({ fx: new SVGNumber(x5), fy: new SVGNumber(y5) }) : this.attr({ x1: new SVGNumber(x5), y1: new SVGNumber(y5) });
  }
  function to(x5, y5) {
    return (this._element || this).type === "radialGradient" ? this.attr({ cx: new SVGNumber(x5), cy: new SVGNumber(y5) }) : this.attr({ x2: new SVGNumber(x5), y2: new SVGNumber(y5) });
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Gradient.js
  var Gradient = class extends Container {
    constructor(type, attrs2) {
      super(
        nodeOrNew(type + "Gradient", typeof type === "string" ? null : type),
        attrs2
      );
    }
    // custom attr to handle transform
    attr(a, b, c) {
      if (a === "transform") a = "gradientTransform";
      return super.attr(a, b, c);
    }
    bbox() {
      return new Box();
    }
    targets() {
      return baseFind("svg [fill*=" + this.id() + "]");
    }
    // Alias string conversion to fill
    toString() {
      return this.url();
    }
    // Update gradient
    update(block) {
      this.clear();
      if (typeof block === "function") {
        block.call(this, this);
      }
      return this;
    }
    // Return the fill id
    url() {
      return "url(#" + this.id() + ")";
    }
  };
  extend(Gradient, gradiented_exports);
  registerMethods({
    Container: {
      // Create gradient element in defs
      gradient(...args) {
        return this.defs().gradient(...args);
      }
    },
    // define gradient
    Defs: {
      gradient: wrapWithAttrCheck(function(type, block) {
        return this.put(new Gradient(type)).update(block);
      })
    }
  });
  register(Gradient, "Gradient");

  // node_modules/@svgdotjs/svg.js/src/elements/Pattern.js
  var Pattern = class extends Container {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("pattern", node), attrs2);
    }
    // custom attr to handle transform
    attr(a, b, c) {
      if (a === "transform") a = "patternTransform";
      return super.attr(a, b, c);
    }
    bbox() {
      return new Box();
    }
    targets() {
      return baseFind("svg [fill*=" + this.id() + "]");
    }
    // Alias string conversion to fill
    toString() {
      return this.url();
    }
    // Update pattern by rebuilding
    update(block) {
      this.clear();
      if (typeof block === "function") {
        block.call(this, this);
      }
      return this;
    }
    // Return the fill id
    url() {
      return "url(#" + this.id() + ")";
    }
  };
  registerMethods({
    Container: {
      // Create pattern element in defs
      pattern(...args) {
        return this.defs().pattern(...args);
      }
    },
    Defs: {
      pattern: wrapWithAttrCheck(function(width4, height4, block) {
        return this.put(new Pattern()).update(block).attr({
          x: 0,
          y: 0,
          width: width4,
          height: height4,
          patternUnits: "userSpaceOnUse"
        });
      })
    }
  });
  register(Pattern, "Pattern");

  // node_modules/@svgdotjs/svg.js/src/elements/Image.js
  var Image = class extends Shape {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("image", node), attrs2);
    }
    // (re)load image
    load(url, callback) {
      if (!url) return this;
      const img = new globals.window.Image();
      on2(
        img,
        "load",
        function(e) {
          const p = this.parent(Pattern);
          if (this.width() === 0 && this.height() === 0) {
            this.size(img.width, img.height);
          }
          if (p instanceof Pattern) {
            if (p.width() === 0 && p.height() === 0) {
              p.size(this.width(), this.height());
            }
          }
          if (typeof callback === "function") {
            callback.call(this, e);
          }
        },
        this
      );
      on2(img, "load error", function() {
        off(img);
      });
      return this.attr("href", img.src = url, xlink);
    }
  };
  registerAttrHook(function(attr2, val, _this) {
    if (attr2 === "fill" || attr2 === "stroke") {
      if (isImage.test(val)) {
        val = _this.root().defs().image(val);
      }
    }
    if (val instanceof Image) {
      val = _this.root().defs().pattern(0, 0, (pattern) => {
        pattern.add(val);
      });
    }
    return val;
  });
  registerMethods({
    Container: {
      // create image element, load image and set its size
      image: wrapWithAttrCheck(function(source, callback) {
        return this.put(new Image()).size(0, 0).load(source, callback);
      })
    }
  });
  register(Image, "Image");

  // node_modules/@svgdotjs/svg.js/src/types/PointArray.js
  var PointArray = class extends SVGArray {
    // Get bounding box of points
    bbox() {
      let maxX = -Infinity;
      let maxY = -Infinity;
      let minX = Infinity;
      let minY = Infinity;
      this.forEach(function(el) {
        maxX = Math.max(el[0], maxX);
        maxY = Math.max(el[1], maxY);
        minX = Math.min(el[0], minX);
        minY = Math.min(el[1], minY);
      });
      return new Box(minX, minY, maxX - minX, maxY - minY);
    }
    // Move point string
    move(x5, y5) {
      const box = this.bbox();
      x5 -= box.x;
      y5 -= box.y;
      if (!isNaN(x5) && !isNaN(y5)) {
        for (let i = this.length - 1; i >= 0; i--) {
          this[i] = [this[i][0] + x5, this[i][1] + y5];
        }
      }
      return this;
    }
    // Parse point string and flat array
    parse(array2 = [0, 0]) {
      const points = [];
      if (array2 instanceof Array) {
        array2 = Array.prototype.concat.apply([], array2);
      } else {
        array2 = array2.trim().split(delimiter).map(parseFloat);
      }
      if (array2.length % 2 !== 0) array2.pop();
      for (let i = 0, len = array2.length; i < len; i = i + 2) {
        points.push([array2[i], array2[i + 1]]);
      }
      return points;
    }
    // Resize poly string
    size(width4, height4) {
      let i;
      const box = this.bbox();
      for (i = this.length - 1; i >= 0; i--) {
        if (box.width)
          this[i][0] = (this[i][0] - box.x) * width4 / box.width + box.x;
        if (box.height)
          this[i][1] = (this[i][1] - box.y) * height4 / box.height + box.y;
      }
      return this;
    }
    // Convert array to line object
    toLine() {
      return {
        x1: this[0][0],
        y1: this[0][1],
        x2: this[1][0],
        y2: this[1][1]
      };
    }
    // Convert array to string
    toString() {
      const array2 = [];
      for (let i = 0, il = this.length; i < il; i++) {
        array2.push(this[i].join(","));
      }
      return array2.join(" ");
    }
    transform(m) {
      return this.clone().transformO(m);
    }
    // transform points with matrix (similar to Point.transform)
    transformO(m) {
      if (!Matrix.isMatrixLike(m)) {
        m = new Matrix(m);
      }
      for (let i = this.length; i--; ) {
        const [x5, y5] = this[i];
        this[i][0] = m.a * x5 + m.c * y5 + m.e;
        this[i][1] = m.b * x5 + m.d * y5 + m.f;
      }
      return this;
    }
  };

  // node_modules/@svgdotjs/svg.js/src/modules/core/pointed.js
  var pointed_exports = {};
  __export(pointed_exports, {
    MorphArray: () => MorphArray,
    height: () => height2,
    width: () => width2,
    x: () => x2,
    y: () => y2
  });
  var MorphArray = PointArray;
  function x2(x5) {
    return x5 == null ? this.bbox().x : this.move(x5, this.bbox().y);
  }
  function y2(y5) {
    return y5 == null ? this.bbox().y : this.move(this.bbox().x, y5);
  }
  function width2(width4) {
    const b = this.bbox();
    return width4 == null ? b.width : this.size(width4, b.height);
  }
  function height2(height4) {
    const b = this.bbox();
    return height4 == null ? b.height : this.size(b.width, height4);
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Line.js
  var Line = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("line", node), attrs2);
    }
    // Get array
    array() {
      return new PointArray([
        [this.attr("x1"), this.attr("y1")],
        [this.attr("x2"), this.attr("y2")]
      ]);
    }
    // Move by left top corner
    move(x5, y5) {
      return this.attr(this.array().move(x5, y5).toLine());
    }
    // Overwrite native plot() method
    plot(x1, y1, x22, y22) {
      if (x1 == null) {
        return this.array();
      } else if (typeof y1 !== "undefined") {
        x1 = { x1, y1, x2: x22, y2: y22 };
      } else {
        x1 = new PointArray(x1).toLine();
      }
      return this.attr(x1);
    }
    // Set element size to given width and height
    size(width4, height4) {
      const p = proportionalSize(this, width4, height4);
      return this.attr(this.array().size(p.width, p.height).toLine());
    }
  };
  extend(Line, pointed_exports);
  registerMethods({
    Container: {
      // Create a line element
      line: wrapWithAttrCheck(function(...args) {
        return Line.prototype.plot.apply(
          this.put(new Line()),
          args[0] != null ? args : [0, 0, 0, 0]
        );
      })
    }
  });
  register(Line, "Line");

  // node_modules/@svgdotjs/svg.js/src/elements/Marker.js
  var Marker = class extends Container {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("marker", node), attrs2);
    }
    // Set height of element
    height(height4) {
      return this.attr("markerHeight", height4);
    }
    orient(orient) {
      return this.attr("orient", orient);
    }
    // Set marker refX and refY
    ref(x5, y5) {
      return this.attr("refX", x5).attr("refY", y5);
    }
    // Return the fill id
    toString() {
      return "url(#" + this.id() + ")";
    }
    // Update marker
    update(block) {
      this.clear();
      if (typeof block === "function") {
        block.call(this, this);
      }
      return this;
    }
    // Set width of element
    width(width4) {
      return this.attr("markerWidth", width4);
    }
  };
  registerMethods({
    Container: {
      marker(...args) {
        return this.defs().marker(...args);
      }
    },
    Defs: {
      // Create marker
      marker: wrapWithAttrCheck(function(width4, height4, block) {
        return this.put(new Marker()).size(width4, height4).ref(width4 / 2, height4 / 2).viewbox(0, 0, width4, height4).attr("orient", "auto").update(block);
      })
    },
    marker: {
      // Create and attach markers
      marker(marker, width4, height4, block) {
        let attr2 = ["marker"];
        if (marker !== "all") attr2.push(marker);
        attr2 = attr2.join("-");
        marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width4, height4, block);
        return this.attr(attr2, marker);
      }
    }
  });
  register(Marker, "Marker");

  // node_modules/@svgdotjs/svg.js/src/animation/Controller.js
  function makeSetterGetter(k2, f) {
    return function(v) {
      if (v == null) return this[k2];
      this[k2] = v;
      if (f) f.call(this);
      return this;
    };
  }
  var easing = {
    "-": function(pos) {
      return pos;
    },
    "<>": function(pos) {
      return -Math.cos(pos * Math.PI) / 2 + 0.5;
    },
    ">": function(pos) {
      return Math.sin(pos * Math.PI / 2);
    },
    "<": function(pos) {
      return -Math.cos(pos * Math.PI / 2) + 1;
    },
    bezier: function(x1, y1, x22, y22) {
      return function(t) {
        if (t < 0) {
          if (x1 > 0) {
            return y1 / x1 * t;
          } else if (x22 > 0) {
            return y22 / x22 * t;
          } else {
            return 0;
          }
        } else if (t > 1) {
          if (x22 < 1) {
            return (1 - y22) / (1 - x22) * t + (y22 - x22) / (1 - x22);
          } else if (x1 < 1) {
            return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
          } else {
            return 1;
          }
        } else {
          return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y22 + t ** 3;
        }
      };
    },
    // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
    steps: function(steps, stepPosition = "end") {
      stepPosition = stepPosition.split("-").reverse()[0];
      let jumps = steps;
      if (stepPosition === "none") {
        --jumps;
      } else if (stepPosition === "both") {
        ++jumps;
      }
      return (t, beforeFlag = false) => {
        let step = Math.floor(t * steps);
        const jumping = t * step % 1 === 0;
        if (stepPosition === "start" || stepPosition === "both") {
          ++step;
        }
        if (beforeFlag && jumping) {
          --step;
        }
        if (t >= 0 && step < 0) {
          step = 0;
        }
        if (t <= 1 && step > jumps) {
          step = jumps;
        }
        return step / jumps;
      };
    }
  };
  var Stepper = class {
    done() {
      return false;
    }
  };
  var Ease = class extends Stepper {
    constructor(fn = timeline.ease) {
      super();
      this.ease = easing[fn] || fn;
    }
    step(from2, to2, pos) {
      if (typeof from2 !== "number") {
        return pos < 1 ? from2 : to2;
      }
      return from2 + (to2 - from2) * this.ease(pos);
    }
  };
  var Controller = class extends Stepper {
    constructor(fn) {
      super();
      this.stepper = fn;
    }
    done(c) {
      return c.done;
    }
    step(current, target, dt, c) {
      return this.stepper(current, target, dt, c);
    }
  };
  function recalculate() {
    const duration = (this._duration || 500) / 1e3;
    const overshoot = this._overshoot || 0;
    const eps = 1e-10;
    const pi = Math.PI;
    const os = Math.log(overshoot / 100 + eps);
    const zeta = -os / Math.sqrt(pi * pi + os * os);
    const wn = 3.9 / (zeta * duration);
    this.d = 2 * zeta * wn;
    this.k = wn * wn;
  }
  var Spring = class extends Controller {
    constructor(duration = 500, overshoot = 0) {
      super();
      this.duration(duration).overshoot(overshoot);
    }
    step(current, target, dt, c) {
      if (typeof current === "string") return current;
      c.done = dt === Infinity;
      if (dt === Infinity) return target;
      if (dt === 0) return current;
      if (dt > 100) dt = 16;
      dt /= 1e3;
      const velocity = c.velocity || 0;
      const acceleration = -this.d * velocity - this.k * (current - target);
      const newPosition = current + velocity * dt + acceleration * dt * dt / 2;
      c.velocity = velocity + acceleration * dt;
      c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 2e-3;
      return c.done ? target : newPosition;
    }
  };
  extend(Spring, {
    duration: makeSetterGetter("_duration", recalculate),
    overshoot: makeSetterGetter("_overshoot", recalculate)
  });
  var PID = class extends Controller {
    constructor(p = 0.1, i = 0.01, d = 0, windup = 1e3) {
      super();
      this.p(p).i(i).d(d).windup(windup);
    }
    step(current, target, dt, c) {
      if (typeof current === "string") return current;
      c.done = dt === Infinity;
      if (dt === Infinity) return target;
      if (dt === 0) return current;
      const p = target - current;
      let i = (c.integral || 0) + p * dt;
      const d = (p - (c.error || 0)) / dt;
      const windup = this._windup;
      if (windup !== false) {
        i = Math.max(-windup, Math.min(i, windup));
      }
      c.error = p;
      c.integral = i;
      c.done = Math.abs(p) < 1e-3;
      return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
    }
  };
  extend(PID, {
    windup: makeSetterGetter("_windup"),
    p: makeSetterGetter("P"),
    i: makeSetterGetter("I"),
    d: makeSetterGetter("D")
  });

  // node_modules/@svgdotjs/svg.js/src/utils/pathParser.js
  var segmentParameters = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
    Z: 0
  };
  var pathHandlers = {
    M: function(c, p, p0) {
      p.x = p0.x = c[0];
      p.y = p0.y = c[1];
      return ["M", p.x, p.y];
    },
    L: function(c, p) {
      p.x = c[0];
      p.y = c[1];
      return ["L", c[0], c[1]];
    },
    H: function(c, p) {
      p.x = c[0];
      return ["H", c[0]];
    },
    V: function(c, p) {
      p.y = c[0];
      return ["V", c[0]];
    },
    C: function(c, p) {
      p.x = c[4];
      p.y = c[5];
      return ["C", c[0], c[1], c[2], c[3], c[4], c[5]];
    },
    S: function(c, p) {
      p.x = c[2];
      p.y = c[3];
      return ["S", c[0], c[1], c[2], c[3]];
    },
    Q: function(c, p) {
      p.x = c[2];
      p.y = c[3];
      return ["Q", c[0], c[1], c[2], c[3]];
    },
    T: function(c, p) {
      p.x = c[0];
      p.y = c[1];
      return ["T", c[0], c[1]];
    },
    Z: function(c, p, p0) {
      p.x = p0.x;
      p.y = p0.y;
      return ["Z"];
    },
    A: function(c, p) {
      p.x = c[5];
      p.y = c[6];
      return ["A", c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
    }
  };
  var mlhvqtcsaz = "mlhvqtcsaz".split("");
  for (let i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
    pathHandlers[mlhvqtcsaz[i]] = /* @__PURE__ */ (function(i2) {
      return function(c, p, p0) {
        if (i2 === "H") c[0] = c[0] + p.x;
        else if (i2 === "V") c[0] = c[0] + p.y;
        else if (i2 === "A") {
          c[5] = c[5] + p.x;
          c[6] = c[6] + p.y;
        } else {
          for (let j = 0, jl = c.length; j < jl; ++j) {
            c[j] = c[j] + (j % 2 ? p.y : p.x);
          }
        }
        return pathHandlers[i2](c, p, p0);
      };
    })(mlhvqtcsaz[i].toUpperCase());
  }
  function makeAbsolut(parser2) {
    const command = parser2.segment[0];
    return pathHandlers[command](parser2.segment.slice(1), parser2.p, parser2.p0);
  }
  function segmentComplete(parser2) {
    return parser2.segment.length && parser2.segment.length - 1 === segmentParameters[parser2.segment[0].toUpperCase()];
  }
  function startNewSegment(parser2, token) {
    parser2.inNumber && finalizeNumber(parser2, false);
    const pathLetter = isPathLetter.test(token);
    if (pathLetter) {
      parser2.segment = [token];
    } else {
      const lastCommand = parser2.lastCommand;
      const small = lastCommand.toLowerCase();
      const isSmall = lastCommand === small;
      parser2.segment = [small === "m" ? isSmall ? "l" : "L" : lastCommand];
    }
    parser2.inSegment = true;
    parser2.lastCommand = parser2.segment[0];
    return pathLetter;
  }
  function finalizeNumber(parser2, inNumber) {
    if (!parser2.inNumber) throw new Error("Parser Error");
    parser2.number && parser2.segment.push(parseFloat(parser2.number));
    parser2.inNumber = inNumber;
    parser2.number = "";
    parser2.pointSeen = false;
    parser2.hasExponent = false;
    if (segmentComplete(parser2)) {
      finalizeSegment(parser2);
    }
  }
  function finalizeSegment(parser2) {
    parser2.inSegment = false;
    if (parser2.absolute) {
      parser2.segment = makeAbsolut(parser2);
    }
    parser2.segments.push(parser2.segment);
  }
  function isArcFlag(parser2) {
    if (!parser2.segment.length) return false;
    const isArc = parser2.segment[0].toUpperCase() === "A";
    const length2 = parser2.segment.length;
    return isArc && (length2 === 4 || length2 === 5);
  }
  function isExponential(parser2) {
    return parser2.lastToken.toUpperCase() === "E";
  }
  var pathDelimiters = /* @__PURE__ */ new Set([" ", ",", "	", "\n", "\r", "\f"]);
  function pathParser(d, toAbsolute = true) {
    let index = 0;
    let token = "";
    const parser2 = {
      segment: [],
      inNumber: false,
      number: "",
      lastToken: "",
      inSegment: false,
      segments: [],
      pointSeen: false,
      hasExponent: false,
      absolute: toAbsolute,
      p0: new Point(),
      p: new Point()
    };
    while (parser2.lastToken = token, token = d.charAt(index++)) {
      if (!parser2.inSegment) {
        if (startNewSegment(parser2, token)) {
          continue;
        }
      }
      if (token === ".") {
        if (parser2.pointSeen || parser2.hasExponent) {
          finalizeNumber(parser2, false);
          --index;
          continue;
        }
        parser2.inNumber = true;
        parser2.pointSeen = true;
        parser2.number += token;
        continue;
      }
      if (!isNaN(parseInt(token))) {
        if (parser2.number === "0" || isArcFlag(parser2)) {
          parser2.inNumber = true;
          parser2.number = token;
          finalizeNumber(parser2, true);
          continue;
        }
        parser2.inNumber = true;
        parser2.number += token;
        continue;
      }
      if (pathDelimiters.has(token)) {
        if (parser2.inNumber) {
          finalizeNumber(parser2, false);
        }
        continue;
      }
      if (token === "-" || token === "+") {
        if (parser2.inNumber && !isExponential(parser2)) {
          finalizeNumber(parser2, false);
          --index;
          continue;
        }
        parser2.number += token;
        parser2.inNumber = true;
        continue;
      }
      if (token.toUpperCase() === "E") {
        parser2.number += token;
        parser2.hasExponent = true;
        continue;
      }
      if (isPathLetter.test(token)) {
        if (parser2.inNumber) {
          finalizeNumber(parser2, false);
        } else if (!segmentComplete(parser2)) {
          throw new Error("parser Error");
        } else {
          finalizeSegment(parser2);
        }
        --index;
      }
    }
    if (parser2.inNumber) {
      finalizeNumber(parser2, false);
    }
    if (parser2.inSegment && segmentComplete(parser2)) {
      finalizeSegment(parser2);
    }
    return parser2.segments;
  }

  // node_modules/@svgdotjs/svg.js/src/types/PathArray.js
  function arrayToString(a) {
    let s = "";
    for (let i = 0, il = a.length; i < il; i++) {
      s += a[i][0];
      if (a[i][1] != null) {
        s += a[i][1];
        if (a[i][2] != null) {
          s += " ";
          s += a[i][2];
          if (a[i][3] != null) {
            s += " ";
            s += a[i][3];
            s += " ";
            s += a[i][4];
            if (a[i][5] != null) {
              s += " ";
              s += a[i][5];
              s += " ";
              s += a[i][6];
              if (a[i][7] != null) {
                s += " ";
                s += a[i][7];
              }
            }
          }
        }
      }
    }
    return s + " ";
  }
  var PathArray = class extends SVGArray {
    // Get bounding box of path
    bbox() {
      parser().path.setAttribute("d", this.toString());
      return new Box(parser.nodes.path.getBBox());
    }
    // Move path string
    move(x5, y5) {
      const box = this.bbox();
      x5 -= box.x;
      y5 -= box.y;
      if (!isNaN(x5) && !isNaN(y5)) {
        for (let l, i = this.length - 1; i >= 0; i--) {
          l = this[i][0];
          if (l === "M" || l === "L" || l === "T") {
            this[i][1] += x5;
            this[i][2] += y5;
          } else if (l === "H") {
            this[i][1] += x5;
          } else if (l === "V") {
            this[i][1] += y5;
          } else if (l === "C" || l === "S" || l === "Q") {
            this[i][1] += x5;
            this[i][2] += y5;
            this[i][3] += x5;
            this[i][4] += y5;
            if (l === "C") {
              this[i][5] += x5;
              this[i][6] += y5;
            }
          } else if (l === "A") {
            this[i][6] += x5;
            this[i][7] += y5;
          }
        }
      }
      return this;
    }
    // Absolutize and parse path to array
    parse(d = "M0 0") {
      if (Array.isArray(d)) {
        d = Array.prototype.concat.apply([], d).toString();
      }
      return pathParser(d);
    }
    // Resize path string
    size(width4, height4) {
      const box = this.bbox();
      let i, l;
      box.width = box.width === 0 ? 1 : box.width;
      box.height = box.height === 0 ? 1 : box.height;
      for (i = this.length - 1; i >= 0; i--) {
        l = this[i][0];
        if (l === "M" || l === "L" || l === "T") {
          this[i][1] = (this[i][1] - box.x) * width4 / box.width + box.x;
          this[i][2] = (this[i][2] - box.y) * height4 / box.height + box.y;
        } else if (l === "H") {
          this[i][1] = (this[i][1] - box.x) * width4 / box.width + box.x;
        } else if (l === "V") {
          this[i][1] = (this[i][1] - box.y) * height4 / box.height + box.y;
        } else if (l === "C" || l === "S" || l === "Q") {
          this[i][1] = (this[i][1] - box.x) * width4 / box.width + box.x;
          this[i][2] = (this[i][2] - box.y) * height4 / box.height + box.y;
          this[i][3] = (this[i][3] - box.x) * width4 / box.width + box.x;
          this[i][4] = (this[i][4] - box.y) * height4 / box.height + box.y;
          if (l === "C") {
            this[i][5] = (this[i][5] - box.x) * width4 / box.width + box.x;
            this[i][6] = (this[i][6] - box.y) * height4 / box.height + box.y;
          }
        } else if (l === "A") {
          this[i][1] = this[i][1] * width4 / box.width;
          this[i][2] = this[i][2] * height4 / box.height;
          this[i][6] = (this[i][6] - box.x) * width4 / box.width + box.x;
          this[i][7] = (this[i][7] - box.y) * height4 / box.height + box.y;
        }
      }
      return this;
    }
    // Convert array to string
    toString() {
      return arrayToString(this);
    }
  };

  // node_modules/@svgdotjs/svg.js/src/animation/Morphable.js
  var getClassForType = (value) => {
    const type = typeof value;
    if (type === "number") {
      return SVGNumber;
    } else if (type === "string") {
      if (Color.isColor(value)) {
        return Color;
      } else if (delimiter.test(value)) {
        return isPathLetter.test(value) ? PathArray : SVGArray;
      } else if (numberAndUnit.test(value)) {
        return SVGNumber;
      } else {
        return NonMorphable;
      }
    } else if (morphableTypes.indexOf(value.constructor) > -1) {
      return value.constructor;
    } else if (Array.isArray(value)) {
      return SVGArray;
    } else if (type === "object") {
      return ObjectBag;
    } else {
      return NonMorphable;
    }
  };
  var Morphable = class {
    constructor(stepper) {
      this._stepper = stepper || new Ease("-");
      this._from = null;
      this._to = null;
      this._type = null;
      this._context = null;
      this._morphObj = null;
    }
    at(pos) {
      return this._morphObj.morph(
        this._from,
        this._to,
        pos,
        this._stepper,
        this._context
      );
    }
    done() {
      const complete = this._context.map(this._stepper.done).reduce(function(last, curr) {
        return last && curr;
      }, true);
      return complete;
    }
    from(val) {
      if (val == null) {
        return this._from;
      }
      this._from = this._set(val);
      return this;
    }
    stepper(stepper) {
      if (stepper == null) return this._stepper;
      this._stepper = stepper;
      return this;
    }
    to(val) {
      if (val == null) {
        return this._to;
      }
      this._to = this._set(val);
      return this;
    }
    type(type) {
      if (type == null) {
        return this._type;
      }
      this._type = type;
      return this;
    }
    _set(value) {
      if (!this._type) {
        this.type(getClassForType(value));
      }
      let result = new this._type(value);
      if (this._type === Color) {
        result = this._to ? result[this._to[4]]() : this._from ? result[this._from[4]]() : result;
      }
      if (this._type === ObjectBag) {
        result = this._to ? result.align(this._to) : this._from ? result.align(this._from) : result;
      }
      result = result.toConsumable();
      this._morphObj = this._morphObj || new this._type();
      this._context = this._context || Array.apply(null, Array(result.length)).map(Object).map(function(o) {
        o.done = true;
        return o;
      });
      return result;
    }
  };
  var NonMorphable = class {
    constructor(...args) {
      this.init(...args);
    }
    init(val) {
      val = Array.isArray(val) ? val[0] : val;
      this.value = val;
      return this;
    }
    toArray() {
      return [this.value];
    }
    valueOf() {
      return this.value;
    }
  };
  var TransformBag = class _TransformBag {
    constructor(...args) {
      this.init(...args);
    }
    init(obj) {
      if (Array.isArray(obj)) {
        obj = {
          scaleX: obj[0],
          scaleY: obj[1],
          shear: obj[2],
          rotate: obj[3],
          translateX: obj[4],
          translateY: obj[5],
          originX: obj[6],
          originY: obj[7]
        };
      }
      Object.assign(this, _TransformBag.defaults, obj);
      return this;
    }
    toArray() {
      const v = this;
      return [
        v.scaleX,
        v.scaleY,
        v.shear,
        v.rotate,
        v.translateX,
        v.translateY,
        v.originX,
        v.originY
      ];
    }
  };
  TransformBag.defaults = {
    scaleX: 1,
    scaleY: 1,
    shear: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0
  };
  var sortByKey = (a, b) => {
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  };
  var ObjectBag = class {
    constructor(...args) {
      this.init(...args);
    }
    align(other) {
      const values = this.values;
      for (let i = 0, il = values.length; i < il; ++i) {
        if (values[i + 1] === other[i + 1]) {
          if (values[i + 1] === Color && other[i + 7] !== values[i + 7]) {
            const space = other[i + 7];
            const color = new Color(this.values.splice(i + 3, 5))[space]().toArray();
            this.values.splice(i + 3, 0, ...color);
          }
          i += values[i + 2] + 2;
          continue;
        }
        if (!other[i + 1]) {
          return this;
        }
        const defaultObject = new other[i + 1]().toArray();
        const toDelete = values[i + 2] + 3;
        values.splice(
          i,
          toDelete,
          other[i],
          other[i + 1],
          other[i + 2],
          ...defaultObject
        );
        i += values[i + 2] + 2;
      }
      return this;
    }
    init(objOrArr) {
      this.values = [];
      if (Array.isArray(objOrArr)) {
        this.values = objOrArr.slice();
        return;
      }
      objOrArr = objOrArr || {};
      const entries = [];
      for (const i in objOrArr) {
        const Type = getClassForType(objOrArr[i]);
        const val = new Type(objOrArr[i]).toArray();
        entries.push([i, Type, val.length, ...val]);
      }
      entries.sort(sortByKey);
      this.values = entries.reduce((last, curr) => last.concat(curr), []);
      return this;
    }
    toArray() {
      return this.values;
    }
    valueOf() {
      const obj = {};
      const arr = this.values;
      while (arr.length) {
        const key = arr.shift();
        const Type = arr.shift();
        const num = arr.shift();
        const values = arr.splice(0, num);
        obj[key] = new Type(values);
      }
      return obj;
    }
  };
  var morphableTypes = [NonMorphable, TransformBag, ObjectBag];
  function registerMorphableType(type = []) {
    morphableTypes.push(...[].concat(type));
  }
  function makeMorphable() {
    extend(morphableTypes, {
      to(val) {
        return new Morphable().type(this.constructor).from(this.toArray()).to(val);
      },
      fromArray(arr) {
        this.init(arr);
        return this;
      },
      toConsumable() {
        return this.toArray();
      },
      morph(from2, to2, pos, stepper, context) {
        const mapper = function(i, index) {
          return stepper.step(i, to2[index], pos, context[index], context);
        };
        return this.fromArray(from2.map(mapper));
      }
    });
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Path.js
  var Path = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("path", node), attrs2);
    }
    // Get array
    array() {
      return this._array || (this._array = new PathArray(this.attr("d")));
    }
    // Clear array cache
    clear() {
      delete this._array;
      return this;
    }
    // Set height of element
    height(height4) {
      return height4 == null ? this.bbox().height : this.size(this.bbox().width, height4);
    }
    // Move by left top corner
    move(x5, y5) {
      return this.attr("d", this.array().move(x5, y5));
    }
    // Plot new path
    plot(d) {
      return d == null ? this.array() : this.clear().attr(
        "d",
        typeof d === "string" ? d : this._array = new PathArray(d)
      );
    }
    // Set element size to given width and height
    size(width4, height4) {
      const p = proportionalSize(this, width4, height4);
      return this.attr("d", this.array().size(p.width, p.height));
    }
    // Set width of element
    width(width4) {
      return width4 == null ? this.bbox().width : this.size(width4, this.bbox().height);
    }
    // Move by left top corner over x-axis
    x(x5) {
      return x5 == null ? this.bbox().x : this.move(x5, this.bbox().y);
    }
    // Move by left top corner over y-axis
    y(y5) {
      return y5 == null ? this.bbox().y : this.move(this.bbox().x, y5);
    }
  };
  Path.prototype.MorphArray = PathArray;
  registerMethods({
    Container: {
      // Create a wrapped path element
      path: wrapWithAttrCheck(function(d) {
        return this.put(new Path()).plot(d || new PathArray());
      })
    }
  });
  register(Path, "Path");

  // node_modules/@svgdotjs/svg.js/src/modules/core/poly.js
  var poly_exports = {};
  __export(poly_exports, {
    array: () => array,
    clear: () => clear,
    move: () => move,
    plot: () => plot,
    size: () => size
  });
  function array() {
    return this._array || (this._array = new PointArray(this.attr("points")));
  }
  function clear() {
    delete this._array;
    return this;
  }
  function move(x5, y5) {
    return this.attr("points", this.array().move(x5, y5));
  }
  function plot(p) {
    return p == null ? this.array() : this.clear().attr(
      "points",
      typeof p === "string" ? p : this._array = new PointArray(p)
    );
  }
  function size(width4, height4) {
    const p = proportionalSize(this, width4, height4);
    return this.attr("points", this.array().size(p.width, p.height));
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Polygon.js
  var Polygon = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("polygon", node), attrs2);
    }
  };
  registerMethods({
    Container: {
      // Create a wrapped polygon element
      polygon: wrapWithAttrCheck(function(p) {
        return this.put(new Polygon()).plot(p || new PointArray());
      })
    }
  });
  extend(Polygon, pointed_exports);
  extend(Polygon, poly_exports);
  register(Polygon, "Polygon");

  // node_modules/@svgdotjs/svg.js/src/elements/Polyline.js
  var Polyline = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("polyline", node), attrs2);
    }
  };
  registerMethods({
    Container: {
      // Create a wrapped polygon element
      polyline: wrapWithAttrCheck(function(p) {
        return this.put(new Polyline()).plot(p || new PointArray());
      })
    }
  });
  extend(Polyline, pointed_exports);
  extend(Polyline, poly_exports);
  register(Polyline, "Polyline");

  // node_modules/@svgdotjs/svg.js/src/elements/Rect.js
  var Rect = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("rect", node), attrs2);
    }
  };
  extend(Rect, { rx, ry });
  registerMethods({
    Container: {
      // Create a rect element
      rect: wrapWithAttrCheck(function(width4, height4) {
        return this.put(new Rect()).size(width4, height4);
      })
    }
  });
  register(Rect, "Rect");

  // node_modules/@svgdotjs/svg.js/src/animation/Queue.js
  var Queue = class {
    constructor() {
      this._first = null;
      this._last = null;
    }
    // Shows us the first item in the list
    first() {
      return this._first && this._first.value;
    }
    // Shows us the last item in the list
    last() {
      return this._last && this._last.value;
    }
    push(value) {
      const item = typeof value.next !== "undefined" ? value : { value, next: null, prev: null };
      if (this._last) {
        item.prev = this._last;
        this._last.next = item;
        this._last = item;
      } else {
        this._last = item;
        this._first = item;
      }
      return item;
    }
    // Removes the item that was returned from the push
    remove(item) {
      if (item.prev) item.prev.next = item.next;
      if (item.next) item.next.prev = item.prev;
      if (item === this._last) this._last = item.prev;
      if (item === this._first) this._first = item.next;
      item.prev = null;
      item.next = null;
    }
    shift() {
      const remove = this._first;
      if (!remove) return null;
      this._first = remove.next;
      if (this._first) this._first.prev = null;
      this._last = this._first ? this._last : null;
      return remove.value;
    }
  };

  // node_modules/@svgdotjs/svg.js/src/animation/Animator.js
  var Animator = {
    nextDraw: null,
    frames: new Queue(),
    timeouts: new Queue(),
    immediates: new Queue(),
    timer: () => globals.window.performance || globals.window.Date,
    transforms: [],
    frame(fn) {
      const node = Animator.frames.push({ run: fn });
      if (Animator.nextDraw === null) {
        Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
      }
      return node;
    },
    timeout(fn, delay) {
      delay = delay || 0;
      const time = Animator.timer().now() + delay;
      const node = Animator.timeouts.push({ run: fn, time });
      if (Animator.nextDraw === null) {
        Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
      }
      return node;
    },
    immediate(fn) {
      const node = Animator.immediates.push(fn);
      if (Animator.nextDraw === null) {
        Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
      }
      return node;
    },
    cancelFrame(node) {
      node != null && Animator.frames.remove(node);
    },
    clearTimeout(node) {
      node != null && Animator.timeouts.remove(node);
    },
    cancelImmediate(node) {
      node != null && Animator.immediates.remove(node);
    },
    _draw(now) {
      let nextTimeout = null;
      const lastTimeout = Animator.timeouts.last();
      while (nextTimeout = Animator.timeouts.shift()) {
        if (now >= nextTimeout.time) {
          nextTimeout.run();
        } else {
          Animator.timeouts.push(nextTimeout);
        }
        if (nextTimeout === lastTimeout) break;
      }
      let nextFrame = null;
      const lastFrame = Animator.frames.last();
      while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
        nextFrame.run(now);
      }
      let nextImmediate = null;
      while (nextImmediate = Animator.immediates.shift()) {
        nextImmediate();
      }
      Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first() ? globals.window.requestAnimationFrame(Animator._draw) : null;
    }
  };
  var Animator_default = Animator;

  // node_modules/@svgdotjs/svg.js/src/animation/Timeline.js
  var makeSchedule = function(runnerInfo) {
    const start = runnerInfo.start;
    const duration = runnerInfo.runner.duration();
    const end = start + duration;
    return {
      start,
      duration,
      end,
      runner: runnerInfo.runner
    };
  };
  var defaultSource = function() {
    const w = globals.window;
    return (w.performance || w.Date).now();
  };
  var Timeline = class extends EventTarget {
    // Construct a new timeline on the given element
    constructor(timeSource = defaultSource) {
      super();
      this._timeSource = timeSource;
      this.terminate();
    }
    active() {
      return !!this._nextFrame;
    }
    finish() {
      this.time(this.getEndTimeOfTimeline() + 1);
      return this.pause();
    }
    // Calculates the end of the timeline
    getEndTime() {
      const lastRunnerInfo = this.getLastRunnerInfo();
      const lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
      const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
      return lastStartTime + lastDuration;
    }
    getEndTimeOfTimeline() {
      const endTimes = this._runners.map((i) => i.start + i.runner.duration());
      return Math.max(0, ...endTimes);
    }
    getLastRunnerInfo() {
      return this.getRunnerInfoById(this._lastRunnerId);
    }
    getRunnerInfoById(id) {
      return this._runners[this._runnerIds.indexOf(id)] || null;
    }
    pause() {
      this._paused = true;
      return this._continue();
    }
    persist(dtOrForever) {
      if (dtOrForever == null) return this._persist;
      this._persist = dtOrForever;
      return this;
    }
    play() {
      this._paused = false;
      return this.updateTime()._continue();
    }
    reverse(yes) {
      const currentSpeed = this.speed();
      if (yes == null) return this.speed(-currentSpeed);
      const positive = Math.abs(currentSpeed);
      return this.speed(yes ? -positive : positive);
    }
    // schedules a runner on the timeline
    schedule(runner, delay, when) {
      if (runner == null) {
        return this._runners.map(makeSchedule);
      }
      let absoluteStartTime = 0;
      const endTime = this.getEndTime();
      delay = delay || 0;
      if (when == null || when === "last" || when === "after") {
        absoluteStartTime = endTime;
      } else if (when === "absolute" || when === "start") {
        absoluteStartTime = delay;
        delay = 0;
      } else if (when === "now") {
        absoluteStartTime = this._time;
      } else if (when === "relative") {
        const runnerInfo2 = this.getRunnerInfoById(runner.id);
        if (runnerInfo2) {
          absoluteStartTime = runnerInfo2.start + delay;
          delay = 0;
        }
      } else if (when === "with-last") {
        const lastRunnerInfo = this.getLastRunnerInfo();
        const lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
        absoluteStartTime = lastStartTime;
      } else {
        throw new Error('Invalid value for the "when" parameter');
      }
      runner.unschedule();
      runner.timeline(this);
      const persist = runner.persist();
      const runnerInfo = {
        persist: persist === null ? this._persist : persist,
        start: absoluteStartTime + delay,
        runner
      };
      this._lastRunnerId = runner.id;
      this._runners.push(runnerInfo);
      this._runners.sort((a, b) => a.start - b.start);
      this._runnerIds = this._runners.map((info) => info.runner.id);
      this.updateTime()._continue();
      return this;
    }
    seek(dt) {
      return this.time(this._time + dt);
    }
    source(fn) {
      if (fn == null) return this._timeSource;
      this._timeSource = fn;
      return this;
    }
    speed(speed) {
      if (speed == null) return this._speed;
      this._speed = speed;
      return this;
    }
    stop() {
      this.time(0);
      return this.pause();
    }
    time(time) {
      if (time == null) return this._time;
      this._time = time;
      return this._continue(true);
    }
    // Remove the runner from this timeline
    unschedule(runner) {
      const index = this._runnerIds.indexOf(runner.id);
      if (index < 0) return this;
      this._runners.splice(index, 1);
      this._runnerIds.splice(index, 1);
      runner.timeline(null);
      return this;
    }
    // Makes sure, that after pausing the time doesn't jump
    updateTime() {
      if (!this.active()) {
        this._lastSourceTime = this._timeSource();
      }
      return this;
    }
    // Checks if we are running and continues the animation
    _continue(immediateStep = false) {
      Animator_default.cancelFrame(this._nextFrame);
      this._nextFrame = null;
      if (immediateStep) return this._stepImmediate();
      if (this._paused) return this;
      this._nextFrame = Animator_default.frame(this._step);
      return this;
    }
    _stepFn(immediateStep = false) {
      const time = this._timeSource();
      let dtSource = time - this._lastSourceTime;
      if (immediateStep) dtSource = 0;
      const dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
      this._lastSourceTime = time;
      if (!immediateStep) {
        this._time += dtTime;
        this._time = this._time < 0 ? 0 : this._time;
      }
      this._lastStepTime = this._time;
      this.fire("time", this._time);
      for (let k2 = this._runners.length; k2--; ) {
        const runnerInfo = this._runners[k2];
        const runner = runnerInfo.runner;
        const dtToStart = this._time - runnerInfo.start;
        if (dtToStart <= 0) {
          runner.reset();
        }
      }
      let runnersLeft = false;
      for (let i = 0, len = this._runners.length; i < len; i++) {
        const runnerInfo = this._runners[i];
        const runner = runnerInfo.runner;
        let dt = dtTime;
        const dtToStart = this._time - runnerInfo.start;
        if (dtToStart <= 0) {
          runnersLeft = true;
          continue;
        } else if (dtToStart < dt) {
          dt = dtToStart;
        }
        if (!runner.active()) continue;
        const finished = runner.step(dt).done;
        if (!finished) {
          runnersLeft = true;
        } else if (runnerInfo.persist !== true) {
          const endTime = runner.duration() - runner.time() + this._time;
          if (endTime + runnerInfo.persist < this._time) {
            runner.unschedule();
            --i;
            --len;
          }
        }
      }
      if (runnersLeft && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0) {
        this._continue();
      } else {
        this.pause();
        this.fire("finished");
      }
      return this;
    }
    terminate() {
      this._startTime = 0;
      this._speed = 1;
      this._persist = 0;
      this._nextFrame = null;
      this._paused = true;
      this._runners = [];
      this._runnerIds = [];
      this._lastRunnerId = -1;
      this._time = 0;
      this._lastSourceTime = 0;
      this._lastStepTime = 0;
      this._step = this._stepFn.bind(this, false);
      this._stepImmediate = this._stepFn.bind(this, true);
    }
  };
  registerMethods({
    Element: {
      timeline: function(timeline2) {
        if (timeline2 == null) {
          this._timeline = this._timeline || new Timeline();
          return this._timeline;
        } else {
          this._timeline = timeline2;
          return this;
        }
      }
    }
  });

  // node_modules/@svgdotjs/svg.js/src/animation/Runner.js
  var Runner = class _Runner extends EventTarget {
    constructor(options) {
      super();
      this.id = _Runner.id++;
      options = options == null ? timeline.duration : options;
      options = typeof options === "function" ? new Controller(options) : options;
      this._element = null;
      this._timeline = null;
      this.done = false;
      this._queue = [];
      this._duration = typeof options === "number" && options;
      this._isDeclarative = options instanceof Controller;
      this._stepper = this._isDeclarative ? options : new Ease();
      this._history = {};
      this.enabled = true;
      this._time = 0;
      this._lastTime = 0;
      this._reseted = true;
      this.transforms = new Matrix();
      this.transformId = 1;
      this._haveReversed = false;
      this._reverse = false;
      this._loopsDone = 0;
      this._swing = false;
      this._wait = 0;
      this._times = 1;
      this._frameId = null;
      this._persist = this._isDeclarative ? true : null;
    }
    static sanitise(duration, delay, when) {
      let times = 1;
      let swing = false;
      let wait = 0;
      duration = duration ?? timeline.duration;
      delay = delay ?? timeline.delay;
      when = when || "last";
      if (typeof duration === "object" && !(duration instanceof Stepper)) {
        delay = duration.delay ?? delay;
        when = duration.when ?? when;
        swing = duration.swing || swing;
        times = duration.times ?? times;
        wait = duration.wait ?? wait;
        duration = duration.duration ?? timeline.duration;
      }
      return {
        duration,
        delay,
        swing,
        times,
        wait,
        when
      };
    }
    active(enabled) {
      if (enabled == null) return this.enabled;
      this.enabled = enabled;
      return this;
    }
    /*
    Private Methods
    ===============
    Methods that shouldn't be used externally
    */
    addTransform(transform2) {
      this.transforms.lmultiplyO(transform2);
      return this;
    }
    after(fn) {
      return this.on("finished", fn);
    }
    animate(duration, delay, when) {
      const o = _Runner.sanitise(duration, delay, when);
      const runner = new _Runner(o.duration);
      if (this._timeline) runner.timeline(this._timeline);
      if (this._element) runner.element(this._element);
      return runner.loop(o).schedule(o.delay, o.when);
    }
    clearTransform() {
      this.transforms = new Matrix();
      return this;
    }
    // TODO: Keep track of all transformations so that deletion is faster
    clearTransformsFromQueue() {
      if (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) {
        this._queue = this._queue.filter((item) => {
          return !item.isTransform;
        });
      }
    }
    delay(delay) {
      return this.animate(0, delay);
    }
    duration() {
      return this._times * (this._wait + this._duration) - this._wait;
    }
    during(fn) {
      return this.queue(null, fn);
    }
    ease(fn) {
      this._stepper = new Ease(fn);
      return this;
    }
    /*
    Runner Definitions
    ==================
    These methods help us define the runtime behaviour of the Runner or they
    help us make new runners from the current runner
    */
    element(element) {
      if (element == null) return this._element;
      this._element = element;
      element._prepareRunner();
      return this;
    }
    finish() {
      return this.step(Infinity);
    }
    loop(times, swing, wait) {
      if (typeof times === "object") {
        swing = times.swing;
        wait = times.wait;
        times = times.times;
      }
      this._times = times || Infinity;
      this._swing = swing || false;
      this._wait = wait || 0;
      if (this._times === true) {
        this._times = Infinity;
      }
      return this;
    }
    loops(p) {
      const loopDuration = this._duration + this._wait;
      if (p == null) {
        const loopsDone = Math.floor(this._time / loopDuration);
        const relativeTime = this._time - loopsDone * loopDuration;
        const position2 = relativeTime / this._duration;
        return Math.min(loopsDone + position2, this._times);
      }
      const whole = Math.floor(p);
      const partial = p % 1;
      const time = loopDuration * whole + this._duration * partial;
      return this.time(time);
    }
    persist(dtOrForever) {
      if (dtOrForever == null) return this._persist;
      this._persist = dtOrForever;
      return this;
    }
    position(p) {
      const x5 = this._time;
      const d = this._duration;
      const w = this._wait;
      const t = this._times;
      const s = this._swing;
      const r = this._reverse;
      let position2;
      if (p == null) {
        const f = function(x6) {
          const swinging = s * Math.floor(x6 % (2 * (w + d)) / (w + d));
          const backwards = swinging && !r || !swinging && r;
          const uncliped = Math.pow(-1, backwards) * (x6 % (w + d)) / d + backwards;
          const clipped = Math.max(Math.min(uncliped, 1), 0);
          return clipped;
        };
        const endTime = t * (w + d) - w;
        position2 = x5 <= 0 ? Math.round(f(1e-5)) : x5 < endTime ? f(x5) : Math.round(f(endTime - 1e-5));
        return position2;
      }
      const loopsDone = Math.floor(this.loops());
      const swingForward = s && loopsDone % 2 === 0;
      const forwards = swingForward && !r || r && swingForward;
      position2 = loopsDone + (forwards ? p : 1 - p);
      return this.loops(position2);
    }
    progress(p) {
      if (p == null) {
        return Math.min(1, this._time / this.duration());
      }
      return this.time(p * this.duration());
    }
    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */
    queue(initFn, runFn, retargetFn, isTransform) {
      this._queue.push({
        initialiser: initFn || noop,
        runner: runFn || noop,
        retarget: retargetFn,
        isTransform,
        initialised: false,
        finished: false
      });
      const timeline2 = this.timeline();
      timeline2 && this.timeline()._continue();
      return this;
    }
    reset() {
      if (this._reseted) return this;
      this.time(0);
      this._reseted = true;
      return this;
    }
    reverse(reverse) {
      this._reverse = reverse == null ? !this._reverse : reverse;
      return this;
    }
    schedule(timeline2, delay, when) {
      if (!(timeline2 instanceof Timeline)) {
        when = delay;
        delay = timeline2;
        timeline2 = this.timeline();
      }
      if (!timeline2) {
        throw Error("Runner cannot be scheduled without timeline");
      }
      timeline2.schedule(this, delay, when);
      return this;
    }
    step(dt) {
      if (!this.enabled) return this;
      dt = dt == null ? 16 : dt;
      this._time += dt;
      const position2 = this.position();
      const running = this._lastPosition !== position2 && this._time >= 0;
      this._lastPosition = position2;
      const duration = this.duration();
      const justStarted = this._lastTime <= 0 && this._time > 0;
      const justFinished = this._lastTime < duration && this._time >= duration;
      this._lastTime = this._time;
      if (justStarted) {
        this.fire("start", this);
      }
      const declarative = this._isDeclarative;
      this.done = !declarative && !justFinished && this._time >= duration;
      this._reseted = false;
      let converged = false;
      if (running || declarative) {
        this._initialise(running);
        this.transforms = new Matrix();
        converged = this._run(declarative ? dt : position2);
        this.fire("step", this);
      }
      this.done = this.done || converged && declarative;
      if (justFinished) {
        this.fire("finished", this);
      }
      return this;
    }
    /*
    Runner animation methods
    ========================
    Control how the animation plays
    */
    time(time) {
      if (time == null) {
        return this._time;
      }
      const dt = time - this._time;
      this.step(dt);
      return this;
    }
    timeline(timeline2) {
      if (typeof timeline2 === "undefined") return this._timeline;
      this._timeline = timeline2;
      return this;
    }
    unschedule() {
      const timeline2 = this.timeline();
      timeline2 && timeline2.unschedule(this);
      return this;
    }
    // Run each initialise function in the runner if required
    _initialise(running) {
      if (!running && !this._isDeclarative) return;
      for (let i = 0, len = this._queue.length; i < len; ++i) {
        const current = this._queue[i];
        const needsIt = this._isDeclarative || !current.initialised && running;
        running = !current.finished;
        if (needsIt && running) {
          current.initialiser.call(this);
          current.initialised = true;
        }
      }
    }
    // Save a morpher to the morpher list so that we can retarget it later
    _rememberMorpher(method, morpher) {
      this._history[method] = {
        morpher,
        caller: this._queue[this._queue.length - 1]
      };
      if (this._isDeclarative) {
        const timeline2 = this.timeline();
        timeline2 && timeline2.play();
      }
    }
    // Try to set the target for a morpher if the morpher exists, otherwise
    // Run each run function for the position or dt given
    _run(positionOrDt) {
      let allfinished = true;
      for (let i = 0, len = this._queue.length; i < len; ++i) {
        const current = this._queue[i];
        const converged = current.runner.call(this, positionOrDt);
        current.finished = current.finished || converged === true;
        allfinished = allfinished && current.finished;
      }
      return allfinished;
    }
    // do nothing and return false
    _tryRetarget(method, target, extra) {
      if (this._history[method]) {
        if (!this._history[method].caller.initialised) {
          const index = this._queue.indexOf(this._history[method].caller);
          this._queue.splice(index, 1);
          return false;
        }
        if (this._history[method].caller.retarget) {
          this._history[method].caller.retarget.call(this, target, extra);
        } else {
          this._history[method].morpher.to(target);
        }
        this._history[method].caller.finished = false;
        const timeline2 = this.timeline();
        timeline2 && timeline2.play();
        return true;
      }
      return false;
    }
  };
  Runner.id = 0;
  var FakeRunner = class {
    constructor(transforms2 = new Matrix(), id = -1, done = true) {
      this.transforms = transforms2;
      this.id = id;
      this.done = done;
    }
    clearTransformsFromQueue() {
    }
  };
  extend([Runner, FakeRunner], {
    mergeWith(runner) {
      return new FakeRunner(
        runner.transforms.lmultiply(this.transforms),
        runner.id
      );
    }
  });
  var lmultiply = (last, curr) => last.lmultiplyO(curr);
  var getRunnerTransform = (runner) => runner.transforms;
  function mergeTransforms() {
    const runners = this._transformationRunners.runners;
    const netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
    this.transform(netTransform);
    this._transformationRunners.merge();
    if (this._transformationRunners.length() === 1) {
      this._frameId = null;
    }
  }
  var RunnerArray = class {
    constructor() {
      this.runners = [];
      this.ids = [];
    }
    add(runner) {
      if (this.runners.includes(runner)) return;
      const id = runner.id + 1;
      this.runners.push(runner);
      this.ids.push(id);
      return this;
    }
    clearBefore(id) {
      const deleteCnt = this.ids.indexOf(id + 1) || 1;
      this.ids.splice(0, deleteCnt, 0);
      this.runners.splice(0, deleteCnt, new FakeRunner()).forEach((r) => r.clearTransformsFromQueue());
      return this;
    }
    edit(id, newRunner) {
      const index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1, id + 1);
      this.runners.splice(index, 1, newRunner);
      return this;
    }
    getByID(id) {
      return this.runners[this.ids.indexOf(id + 1)];
    }
    length() {
      return this.ids.length;
    }
    merge() {
      let lastRunner = null;
      for (let i = 0; i < this.runners.length; ++i) {
        const runner = this.runners[i];
        const condition = lastRunner && runner.done && lastRunner.done && // don't merge runner when persisted on timeline
        (!runner._timeline || !runner._timeline._runnerIds.includes(runner.id)) && (!lastRunner._timeline || !lastRunner._timeline._runnerIds.includes(lastRunner.id));
        if (condition) {
          this.remove(runner.id);
          const newRunner = runner.mergeWith(lastRunner);
          this.edit(lastRunner.id, newRunner);
          lastRunner = newRunner;
          --i;
        } else {
          lastRunner = runner;
        }
      }
      return this;
    }
    remove(id) {
      const index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1);
      this.runners.splice(index, 1);
      return this;
    }
  };
  registerMethods({
    Element: {
      animate(duration, delay, when) {
        const o = Runner.sanitise(duration, delay, when);
        const timeline2 = this.timeline();
        return new Runner(o.duration).loop(o).element(this).timeline(timeline2.play()).schedule(o.delay, o.when);
      },
      delay(by, when) {
        return this.animate(0, by, when);
      },
      // this function searches for all runners on the element and deletes the ones
      // which run before the current one. This is because absolute transformations
      // overwrite anything anyway so there is no need to waste time computing
      // other runners
      _clearTransformRunnersBefore(currentRunner) {
        this._transformationRunners.clearBefore(currentRunner.id);
      },
      _currentTransform(current) {
        return this._transformationRunners.runners.filter((runner) => runner.id <= current.id).map(getRunnerTransform).reduce(lmultiply, new Matrix());
      },
      _addRunner(runner) {
        this._transformationRunners.add(runner);
        Animator_default.cancelImmediate(this._frameId);
        this._frameId = Animator_default.immediate(mergeTransforms.bind(this));
      },
      _prepareRunner() {
        if (this._frameId == null) {
          this._transformationRunners = new RunnerArray().add(
            new FakeRunner(new Matrix(this))
          );
        }
      }
    }
  });
  var difference = (a, b) => a.filter((x5) => !b.includes(x5));
  extend(Runner, {
    attr(a, v) {
      return this.styleAttr("attr", a, v);
    },
    // Add animatable styles
    css(s, v) {
      return this.styleAttr("css", s, v);
    },
    styleAttr(type, nameOrAttrs, val) {
      if (typeof nameOrAttrs === "string") {
        return this.styleAttr(type, { [nameOrAttrs]: val });
      }
      let attrs2 = nameOrAttrs;
      if (this._tryRetarget(type, attrs2)) return this;
      let morpher = new Morphable(this._stepper).to(attrs2);
      let keys = Object.keys(attrs2);
      this.queue(
        function() {
          morpher = morpher.from(this.element()[type](keys));
        },
        function(pos) {
          this.element()[type](morpher.at(pos).valueOf());
          return morpher.done();
        },
        function(newToAttrs) {
          const newKeys = Object.keys(newToAttrs);
          const differences = difference(newKeys, keys);
          if (differences.length) {
            const addedFromAttrs = this.element()[type](differences);
            const oldFromAttrs = new ObjectBag(morpher.from()).valueOf();
            Object.assign(oldFromAttrs, addedFromAttrs);
            morpher.from(oldFromAttrs);
          }
          const oldToAttrs = new ObjectBag(morpher.to()).valueOf();
          Object.assign(oldToAttrs, newToAttrs);
          morpher.to(oldToAttrs);
          keys = newKeys;
          attrs2 = newToAttrs;
        }
      );
      this._rememberMorpher(type, morpher);
      return this;
    },
    zoom(level, point2) {
      if (this._tryRetarget("zoom", level, point2)) return this;
      let morpher = new Morphable(this._stepper).to(new SVGNumber(level));
      this.queue(
        function() {
          morpher = morpher.from(this.element().zoom());
        },
        function(pos) {
          this.element().zoom(morpher.at(pos), point2);
          return morpher.done();
        },
        function(newLevel, newPoint) {
          point2 = newPoint;
          morpher.to(newLevel);
        }
      );
      this._rememberMorpher("zoom", morpher);
      return this;
    },
    /**
     ** absolute transformations
     **/
    //
    // M v -----|-----(D M v = F v)------|----->  T v
    //
    // 1. define the final state (T) and decompose it (once)
    //    t = [tx, ty, the, lam, sy, sx]
    // 2. on every frame: pull the current state of all previous transforms
    //    (M - m can change)
    //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
    // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
    //   - Note F(0) = M
    //   - Note F(1) = T
    // 4. Now you get the delta matrix as a result: D = F * inv(M)
    transform(transforms2, relative, affine) {
      relative = transforms2.relative || relative;
      if (this._isDeclarative && !relative && this._tryRetarget("transform", transforms2)) {
        return this;
      }
      const isMatrix = Matrix.isMatrixLike(transforms2);
      affine = transforms2.affine != null ? transforms2.affine : affine != null ? affine : !isMatrix;
      const morpher = new Morphable(this._stepper).type(
        affine ? TransformBag : Matrix
      );
      let origin;
      let element;
      let current;
      let currentAngle;
      let startTransform;
      function setup() {
        element = element || this.element();
        origin = origin || getOrigin(transforms2, element);
        startTransform = new Matrix(relative ? void 0 : element);
        element._addRunner(this);
        if (!relative) {
          element._clearTransformRunnersBefore(this);
        }
      }
      function run(pos) {
        if (!relative) this.clearTransform();
        const { x: x5, y: y5 } = new Point(origin).transform(
          element._currentTransform(this)
        );
        let target = new Matrix({ ...transforms2, origin: [x5, y5] });
        let start = this._isDeclarative && current ? current : startTransform;
        if (affine) {
          target = target.decompose(x5, y5);
          start = start.decompose(x5, y5);
          const rTarget = target.rotate;
          const rCurrent = start.rotate;
          const possibilities = [rTarget - 360, rTarget, rTarget + 360];
          const distances = possibilities.map((a) => Math.abs(a - rCurrent));
          const shortest = Math.min(...distances);
          const index = distances.indexOf(shortest);
          target.rotate = possibilities[index];
        }
        if (relative) {
          if (!isMatrix) {
            target.rotate = transforms2.rotate || 0;
          }
          if (this._isDeclarative && currentAngle) {
            start.rotate = currentAngle;
          }
        }
        morpher.from(start);
        morpher.to(target);
        const affineParameters = morpher.at(pos);
        currentAngle = affineParameters.rotate;
        current = new Matrix(affineParameters);
        this.addTransform(current);
        element._addRunner(this);
        return morpher.done();
      }
      function retarget(newTransforms) {
        if ((newTransforms.origin || "center").toString() !== (transforms2.origin || "center").toString()) {
          origin = getOrigin(newTransforms, element);
        }
        transforms2 = { ...newTransforms, origin };
      }
      this.queue(setup, run, retarget, true);
      this._isDeclarative && this._rememberMorpher("transform", morpher);
      return this;
    },
    // Animatable x-axis
    x(x5) {
      return this._queueNumber("x", x5);
    },
    // Animatable y-axis
    y(y5) {
      return this._queueNumber("y", y5);
    },
    ax(x5) {
      return this._queueNumber("ax", x5);
    },
    ay(y5) {
      return this._queueNumber("ay", y5);
    },
    dx(x5 = 0) {
      return this._queueNumberDelta("x", x5);
    },
    dy(y5 = 0) {
      return this._queueNumberDelta("y", y5);
    },
    dmove(x5, y5) {
      return this.dx(x5).dy(y5);
    },
    _queueNumberDelta(method, to2) {
      to2 = new SVGNumber(to2);
      if (this._tryRetarget(method, to2)) return this;
      const morpher = new Morphable(this._stepper).to(to2);
      let from2 = null;
      this.queue(
        function() {
          from2 = this.element()[method]();
          morpher.from(from2);
          morpher.to(from2 + to2);
        },
        function(pos) {
          this.element()[method](morpher.at(pos));
          return morpher.done();
        },
        function(newTo) {
          morpher.to(from2 + new SVGNumber(newTo));
        }
      );
      this._rememberMorpher(method, morpher);
      return this;
    },
    _queueObject(method, to2) {
      if (this._tryRetarget(method, to2)) return this;
      const morpher = new Morphable(this._stepper).to(to2);
      this.queue(
        function() {
          morpher.from(this.element()[method]());
        },
        function(pos) {
          this.element()[method](morpher.at(pos));
          return morpher.done();
        }
      );
      this._rememberMorpher(method, morpher);
      return this;
    },
    _queueNumber(method, value) {
      return this._queueObject(method, new SVGNumber(value));
    },
    // Animatable center x-axis
    cx(x5) {
      return this._queueNumber("cx", x5);
    },
    // Animatable center y-axis
    cy(y5) {
      return this._queueNumber("cy", y5);
    },
    // Add animatable move
    move(x5, y5) {
      return this.x(x5).y(y5);
    },
    amove(x5, y5) {
      return this.ax(x5).ay(y5);
    },
    // Add animatable center
    center(x5, y5) {
      return this.cx(x5).cy(y5);
    },
    // Add animatable size
    size(width4, height4) {
      let box;
      if (!width4 || !height4) {
        box = this._element.bbox();
      }
      if (!width4) {
        width4 = box.width / box.height * height4;
      }
      if (!height4) {
        height4 = box.height / box.width * width4;
      }
      return this.width(width4).height(height4);
    },
    // Add animatable width
    width(width4) {
      return this._queueNumber("width", width4);
    },
    // Add animatable height
    height(height4) {
      return this._queueNumber("height", height4);
    },
    // Add animatable plot
    plot(a, b, c, d) {
      if (arguments.length === 4) {
        return this.plot([a, b, c, d]);
      }
      if (this._tryRetarget("plot", a)) return this;
      const morpher = new Morphable(this._stepper).type(this._element.MorphArray).to(a);
      this.queue(
        function() {
          morpher.from(this._element.array());
        },
        function(pos) {
          this._element.plot(morpher.at(pos));
          return morpher.done();
        }
      );
      this._rememberMorpher("plot", morpher);
      return this;
    },
    // Add leading method
    leading(value) {
      return this._queueNumber("leading", value);
    },
    // Add animatable viewbox
    viewbox(x5, y5, width4, height4) {
      return this._queueObject("viewbox", new Box(x5, y5, width4, height4));
    },
    update(o) {
      if (typeof o !== "object") {
        return this.update({
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        });
      }
      if (o.opacity != null) this.attr("stop-opacity", o.opacity);
      if (o.color != null) this.attr("stop-color", o.color);
      if (o.offset != null) this.attr("offset", o.offset);
      return this;
    }
  });
  extend(Runner, { rx, ry, from, to });
  register(Runner, "Runner");

  // node_modules/@svgdotjs/svg.js/src/elements/Svg.js
  var Svg = class extends Container {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("svg", node), attrs2);
      this.namespace();
    }
    // Creates and returns defs element
    defs() {
      if (!this.isRoot()) return this.root().defs();
      return adopt(this.node.querySelector("defs")) || this.put(new Defs());
    }
    isRoot() {
      return !this.node.parentNode || !(this.node.parentNode instanceof globals.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
    }
    // Add namespaces
    namespace() {
      if (!this.isRoot()) return this.root().namespace();
      return this.attr({ xmlns: svg, version: "1.1" }).attr(
        "xmlns:xlink",
        xlink,
        xmlns
      );
    }
    removeNamespace() {
      return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, xmlns).attr("xmlns:svgjs", null, xmlns);
    }
    // Check if this is a root svg
    // If not, call root() from this element
    root() {
      if (this.isRoot()) return this;
      return super.root();
    }
  };
  registerMethods({
    Container: {
      // Create nested svg document
      nested: wrapWithAttrCheck(function() {
        return this.put(new Svg());
      })
    }
  });
  register(Svg, "Svg", true);

  // node_modules/@svgdotjs/svg.js/src/elements/Symbol.js
  var Symbol2 = class extends Container {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("symbol", node), attrs2);
    }
  };
  registerMethods({
    Container: {
      symbol: wrapWithAttrCheck(function() {
        return this.put(new Symbol2());
      })
    }
  });
  register(Symbol2, "Symbol");

  // node_modules/@svgdotjs/svg.js/src/modules/core/textable.js
  var textable_exports = {};
  __export(textable_exports, {
    amove: () => amove,
    ax: () => ax,
    ay: () => ay,
    build: () => build,
    center: () => center,
    cx: () => cx2,
    cy: () => cy2,
    length: () => length,
    move: () => move2,
    plain: () => plain,
    x: () => x3,
    y: () => y3
  });
  function plain(text) {
    if (this._build === false) {
      this.clear();
    }
    this.node.appendChild(globals.document.createTextNode(text));
    return this;
  }
  function length() {
    return this.node.getComputedTextLength();
  }
  function x3(x5, box = this.bbox()) {
    if (x5 == null) {
      return box.x;
    }
    return this.attr("x", this.attr("x") + x5 - box.x);
  }
  function y3(y5, box = this.bbox()) {
    if (y5 == null) {
      return box.y;
    }
    return this.attr("y", this.attr("y") + y5 - box.y);
  }
  function move2(x5, y5, box = this.bbox()) {
    return this.x(x5, box).y(y5, box);
  }
  function cx2(x5, box = this.bbox()) {
    if (x5 == null) {
      return box.cx;
    }
    return this.attr("x", this.attr("x") + x5 - box.cx);
  }
  function cy2(y5, box = this.bbox()) {
    if (y5 == null) {
      return box.cy;
    }
    return this.attr("y", this.attr("y") + y5 - box.cy);
  }
  function center(x5, y5, box = this.bbox()) {
    return this.cx(x5, box).cy(y5, box);
  }
  function ax(x5) {
    return this.attr("x", x5);
  }
  function ay(y5) {
    return this.attr("y", y5);
  }
  function amove(x5, y5) {
    return this.ax(x5).ay(y5);
  }
  function build(build2) {
    this._build = !!build2;
    return this;
  }

  // node_modules/@svgdotjs/svg.js/src/elements/Text.js
  var Text = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("text", node), attrs2);
      this.dom.leading = this.dom.leading ?? new SVGNumber(1.3);
      this._rebuild = true;
      this._build = false;
    }
    // Set / get leading
    leading(value) {
      if (value == null) {
        return this.dom.leading;
      }
      this.dom.leading = new SVGNumber(value);
      return this.rebuild();
    }
    // Rebuild appearance type
    rebuild(rebuild) {
      if (typeof rebuild === "boolean") {
        this._rebuild = rebuild;
      }
      if (this._rebuild) {
        const self = this;
        let blankLineOffset = 0;
        const leading = this.dom.leading;
        this.each(function(i) {
          if (isDescriptive(this.node)) return;
          const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue("font-size");
          const dy2 = leading * new SVGNumber(fontSize);
          if (this.dom.newLined) {
            this.attr("x", self.attr("x"));
            if (this.text() === "\n") {
              blankLineOffset += dy2;
            } else {
              this.attr("dy", i ? dy2 + blankLineOffset : 0);
              blankLineOffset = 0;
            }
          }
        });
        this.fire("rebuild");
      }
      return this;
    }
    // overwrite method from parent to set data properly
    setData(o) {
      this.dom = o;
      this.dom.leading = new SVGNumber(o.leading || 1.3);
      return this;
    }
    writeDataToDom() {
      writeDataToDom(this, this.dom, { leading: 1.3 });
      return this;
    }
    // Set the text content
    text(text) {
      if (text === void 0) {
        const children = this.node.childNodes;
        let firstLine = 0;
        text = "";
        for (let i = 0, len = children.length; i < len; ++i) {
          if (children[i].nodeName === "textPath" || isDescriptive(children[i])) {
            if (i === 0) firstLine = i + 1;
            continue;
          }
          if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
            text += "\n";
          }
          text += children[i].textContent;
        }
        return text;
      }
      this.clear().build(true);
      if (typeof text === "function") {
        text.call(this, this);
      } else {
        text = (text + "").split("\n");
        for (let j = 0, jl = text.length; j < jl; j++) {
          this.newLine(text[j]);
        }
      }
      return this.build(false).rebuild();
    }
  };
  extend(Text, textable_exports);
  registerMethods({
    Container: {
      // Create text element
      text: wrapWithAttrCheck(function(text = "") {
        return this.put(new Text()).text(text);
      }),
      // Create plain text element
      plain: wrapWithAttrCheck(function(text = "") {
        return this.put(new Text()).plain(text);
      })
    }
  });
  register(Text, "Text");

  // node_modules/@svgdotjs/svg.js/src/elements/Tspan.js
  var Tspan = class extends Shape {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("tspan", node), attrs2);
      this._build = false;
    }
    // Shortcut dx
    dx(dx2) {
      return this.attr("dx", dx2);
    }
    // Shortcut dy
    dy(dy2) {
      return this.attr("dy", dy2);
    }
    // Create new line
    newLine() {
      this.dom.newLined = true;
      const text = this.parent();
      if (!(text instanceof Text)) {
        return this;
      }
      const i = text.index(this);
      const fontSize = globals.window.getComputedStyle(this.node).getPropertyValue("font-size");
      const dy2 = text.dom.leading * new SVGNumber(fontSize);
      return this.dy(i ? dy2 : 0).attr("x", text.x());
    }
    // Set text content
    text(text) {
      if (text == null)
        return this.node.textContent + (this.dom.newLined ? "\n" : "");
      if (typeof text === "function") {
        this.clear().build(true);
        text.call(this, this);
        this.build(false);
      } else {
        this.plain(text);
      }
      return this;
    }
  };
  extend(Tspan, textable_exports);
  registerMethods({
    Tspan: {
      tspan: wrapWithAttrCheck(function(text = "") {
        const tspan = new Tspan();
        if (!this._build) {
          this.clear();
        }
        return this.put(tspan).text(text);
      })
    },
    Text: {
      newLine: function(text = "") {
        return this.tspan(text).newLine();
      }
    }
  });
  register(Tspan, "Tspan");

  // node_modules/@svgdotjs/svg.js/src/elements/Circle.js
  var Circle = class extends Shape {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("circle", node), attrs2);
    }
    radius(r) {
      return this.attr("r", r);
    }
    // Radius x value
    rx(rx2) {
      return this.attr("r", rx2);
    }
    // Alias radius x value
    ry(ry2) {
      return this.rx(ry2);
    }
    size(size3) {
      return this.radius(new SVGNumber(size3).divide(2));
    }
  };
  extend(Circle, { x, y, cx, cy, width, height });
  registerMethods({
    Container: {
      // Create circle element
      circle: wrapWithAttrCheck(function(size3 = 0) {
        return this.put(new Circle()).size(size3).move(0, 0);
      })
    }
  });
  register(Circle, "Circle");

  // node_modules/@svgdotjs/svg.js/src/elements/ClipPath.js
  var ClipPath = class extends Container {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("clipPath", node), attrs2);
    }
    // Unclip all clipped elements and remove itself
    remove() {
      this.targets().forEach(function(el) {
        el.unclip();
      });
      return super.remove();
    }
    targets() {
      return baseFind("svg [clip-path*=" + this.id() + "]");
    }
  };
  registerMethods({
    Container: {
      // Create clipping element
      clip: wrapWithAttrCheck(function() {
        return this.defs().put(new ClipPath());
      })
    },
    Element: {
      // Distribute clipPath to svg element
      clipper() {
        return this.reference("clip-path");
      },
      clipWith(element) {
        const clipper = element instanceof ClipPath ? element : this.parent().clip().add(element);
        return this.attr("clip-path", "url(#" + clipper.id() + ")");
      },
      // Unclip element
      unclip() {
        return this.attr("clip-path", null);
      }
    }
  });
  register(ClipPath, "ClipPath");

  // node_modules/@svgdotjs/svg.js/src/elements/ForeignObject.js
  var ForeignObject = class extends Element {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("foreignObject", node), attrs2);
    }
  };
  registerMethods({
    Container: {
      foreignObject: wrapWithAttrCheck(function(width4, height4) {
        return this.put(new ForeignObject()).size(width4, height4);
      })
    }
  });
  register(ForeignObject, "ForeignObject");

  // node_modules/@svgdotjs/svg.js/src/modules/core/containerGeometry.js
  var containerGeometry_exports = {};
  __export(containerGeometry_exports, {
    dmove: () => dmove,
    dx: () => dx,
    dy: () => dy,
    height: () => height3,
    move: () => move3,
    size: () => size2,
    width: () => width3,
    x: () => x4,
    y: () => y4
  });
  function dmove(dx2, dy2) {
    this.children().forEach((child) => {
      let bbox2;
      try {
        bbox2 = child.node instanceof getWindow().SVGSVGElement ? new Box(child.attr(["x", "y", "width", "height"])) : child.bbox();
      } catch (e) {
        return;
      }
      const m = new Matrix(child);
      const matrix = m.translate(dx2, dy2).transform(m.inverse());
      const p = new Point(bbox2.x, bbox2.y).transform(matrix);
      child.move(p.x, p.y);
    });
    return this;
  }
  function dx(dx2) {
    return this.dmove(dx2, 0);
  }
  function dy(dy2) {
    return this.dmove(0, dy2);
  }
  function height3(height4, box = this.bbox()) {
    if (height4 == null) return box.height;
    return this.size(box.width, height4, box);
  }
  function move3(x5 = 0, y5 = 0, box = this.bbox()) {
    const dx2 = x5 - box.x;
    const dy2 = y5 - box.y;
    return this.dmove(dx2, dy2);
  }
  function size2(width4, height4, box = this.bbox()) {
    const p = proportionalSize(this, width4, height4, box);
    const scaleX = p.width / box.width;
    const scaleY = p.height / box.height;
    this.children().forEach((child) => {
      const o = new Point(box).transform(new Matrix(child).inverse());
      child.scale(scaleX, scaleY, o.x, o.y);
    });
    return this;
  }
  function width3(width4, box = this.bbox()) {
    if (width4 == null) return box.width;
    return this.size(width4, box.height, box);
  }
  function x4(x5, box = this.bbox()) {
    if (x5 == null) return box.x;
    return this.move(x5, box.y, box);
  }
  function y4(y5, box = this.bbox()) {
    if (y5 == null) return box.y;
    return this.move(box.x, y5, box);
  }

  // node_modules/@svgdotjs/svg.js/src/elements/G.js
  var G = class extends Container {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("g", node), attrs2);
    }
  };
  extend(G, containerGeometry_exports);
  registerMethods({
    Container: {
      // Create a group element
      group: wrapWithAttrCheck(function() {
        return this.put(new G());
      })
    }
  });
  register(G, "G");

  // node_modules/@svgdotjs/svg.js/src/elements/A.js
  var A = class extends Container {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("a", node), attrs2);
    }
    // Link target attribute
    target(target) {
      return this.attr("target", target);
    }
    // Link url
    to(url) {
      return this.attr("href", url, xlink);
    }
  };
  extend(A, containerGeometry_exports);
  registerMethods({
    Container: {
      // Create a hyperlink element
      link: wrapWithAttrCheck(function(url) {
        return this.put(new A()).to(url);
      })
    },
    Element: {
      unlink() {
        const link = this.linker();
        if (!link) return this;
        const parent = link.parent();
        if (!parent) {
          return this.remove();
        }
        const index = parent.index(link);
        parent.add(this, index);
        link.remove();
        return this;
      },
      linkTo(url) {
        let link = this.linker();
        if (!link) {
          link = new A();
          this.wrap(link);
        }
        if (typeof url === "function") {
          url.call(link, link);
        } else {
          link.to(url);
        }
        return this;
      },
      linker() {
        const link = this.parent();
        if (link && link.node.nodeName.toLowerCase() === "a") {
          return link;
        }
        return null;
      }
    }
  });
  register(A, "A");

  // node_modules/@svgdotjs/svg.js/src/elements/Mask.js
  var Mask = class extends Container {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("mask", node), attrs2);
    }
    // Unmask all masked elements and remove itself
    remove() {
      this.targets().forEach(function(el) {
        el.unmask();
      });
      return super.remove();
    }
    targets() {
      return baseFind("svg [mask*=" + this.id() + "]");
    }
  };
  registerMethods({
    Container: {
      mask: wrapWithAttrCheck(function() {
        return this.defs().put(new Mask());
      })
    },
    Element: {
      // Distribute mask to svg element
      masker() {
        return this.reference("mask");
      },
      maskWith(element) {
        const masker = element instanceof Mask ? element : this.parent().mask().add(element);
        return this.attr("mask", "url(#" + masker.id() + ")");
      },
      // Unmask element
      unmask() {
        return this.attr("mask", null);
      }
    }
  });
  register(Mask, "Mask");

  // node_modules/@svgdotjs/svg.js/src/elements/Stop.js
  var Stop = class extends Element {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("stop", node), attrs2);
    }
    // add color stops
    update(o) {
      if (typeof o === "number" || o instanceof SVGNumber) {
        o = {
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        };
      }
      if (o.opacity != null) this.attr("stop-opacity", o.opacity);
      if (o.color != null) this.attr("stop-color", o.color);
      if (o.offset != null) this.attr("offset", new SVGNumber(o.offset));
      return this;
    }
  };
  registerMethods({
    Gradient: {
      // Add a color stop
      stop: function(offset, color, opacity) {
        return this.put(new Stop()).update(offset, color, opacity);
      }
    }
  });
  register(Stop, "Stop");

  // node_modules/@svgdotjs/svg.js/src/elements/Style.js
  function cssRule(selector, rule) {
    if (!selector) return "";
    if (!rule) return selector;
    let ret = selector + "{";
    for (const i in rule) {
      ret += unCamelCase(i) + ":" + rule[i] + ";";
    }
    ret += "}";
    return ret;
  }
  var Style = class extends Element {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("style", node), attrs2);
    }
    addText(w = "") {
      this.node.textContent += w;
      return this;
    }
    font(name, src, params = {}) {
      return this.rule("@font-face", {
        fontFamily: name,
        src,
        ...params
      });
    }
    rule(selector, obj) {
      return this.addText(cssRule(selector, obj));
    }
  };
  registerMethods("Dom", {
    style(selector, obj) {
      return this.put(new Style()).rule(selector, obj);
    },
    fontface(name, src, params) {
      return this.put(new Style()).font(name, src, params);
    }
  });
  register(Style, "Style");

  // node_modules/@svgdotjs/svg.js/src/elements/TextPath.js
  var TextPath = class extends Text {
    // Initialize node
    constructor(node, attrs2 = node) {
      super(nodeOrNew("textPath", node), attrs2);
    }
    // return the array of the path track element
    array() {
      const track = this.track();
      return track ? track.array() : null;
    }
    // Plot path if any
    plot(d) {
      const track = this.track();
      let pathArray = null;
      if (track) {
        pathArray = track.plot(d);
      }
      return d == null ? pathArray : this;
    }
    // Get the path element
    track() {
      return this.reference("href");
    }
  };
  registerMethods({
    Container: {
      textPath: wrapWithAttrCheck(function(text, path) {
        if (!(text instanceof Text)) {
          text = this.text(text);
        }
        return text.path(path);
      })
    },
    Text: {
      // Create path for text to run on
      path: wrapWithAttrCheck(function(track, importNodes = true) {
        const textPath = new TextPath();
        if (!(track instanceof Path)) {
          track = this.defs().path(track);
        }
        textPath.attr("href", "#" + track, xlink);
        let node;
        if (importNodes) {
          while (node = this.node.firstChild) {
            textPath.node.appendChild(node);
          }
        }
        return this.put(textPath);
      }),
      // Get the textPath children
      textPath() {
        return this.findOne("textPath");
      }
    },
    Path: {
      // creates a textPath from this path
      text: wrapWithAttrCheck(function(text) {
        if (!(text instanceof Text)) {
          text = new Text().addTo(this.parent()).text(text);
        }
        return text.path(this);
      }),
      targets() {
        return baseFind("svg textPath").filter((node) => {
          return (node.attr("href") || "").includes(this.id());
        });
      }
    }
  });
  TextPath.prototype.MorphArray = PathArray;
  register(TextPath, "TextPath");

  // node_modules/@svgdotjs/svg.js/src/elements/Use.js
  var Use = class extends Shape {
    constructor(node, attrs2 = node) {
      super(nodeOrNew("use", node), attrs2);
    }
    // Use element as a reference
    use(element, file) {
      return this.attr("href", (file || "") + "#" + element, xlink);
    }
  };
  registerMethods({
    Container: {
      // Create a use element
      use: wrapWithAttrCheck(function(element, file) {
        return this.put(new Use()).use(element, file);
      })
    }
  });
  register(Use, "Use");

  // node_modules/@svgdotjs/svg.js/src/main.js
  var SVG = makeInstance;
  extend([Svg, Symbol2, Image, Pattern, Marker], getMethodsFor("viewbox"));
  extend([Line, Polyline, Polygon, Path], getMethodsFor("marker"));
  extend(Text, getMethodsFor("Text"));
  extend(Path, getMethodsFor("Path"));
  extend(Defs, getMethodsFor("Defs"));
  extend([Text, Tspan], getMethodsFor("Tspan"));
  extend([Rect, Ellipse, Gradient, Runner], getMethodsFor("radius"));
  extend(EventTarget, getMethodsFor("EventTarget"));
  extend(Dom, getMethodsFor("Dom"));
  extend(Element, getMethodsFor("Element"));
  extend(Shape, getMethodsFor("Shape"));
  extend([Container, Fragment_default], getMethodsFor("Container"));
  extend(Gradient, getMethodsFor("Gradient"));
  extend(Runner, getMethodsFor("Runner"));
  List_default.extend(getMethodNames());
  registerMorphableType([
    SVGNumber,
    Color,
    Box,
    Matrix,
    SVGArray,
    PointArray,
    PathArray,
    Point
  ]);
  makeMorphable();

  // node_modules/meteojs/thermodynamicDiagram/Functions.js
  function getNormalizedLineStyleOptions({
    color = void 0,
    width: width4 = void 0,
    ...result
  } = {}, defaults = {}) {
    result.color = getFirstDefinedValue(color, defaults.color, "black");
    result.width = getFirstDefinedValue(width4, defaults.width, 1);
    Object.keys(defaults).forEach((key) => {
      if (key != "color" && key != "width" && result[key] === void 0)
        result[key] = defaults[key];
    });
    return result;
  }
  function getNormalizedFontOptions({
    size: size3 = void 0,
    color = void 0,
    anchor = void 0,
    ...result
  } = {}, defaults = {}) {
    result.size = getFirstDefinedValue(size3, defaults.size, 12);
    result.color = getFirstDefinedValue(color, defaults.color, "black");
    anchor = getFirstDefinedValue(anchor, defaults.anchor);
    if (anchor !== void 0)
      result.anchor = anchor;
    Object.keys(defaults).forEach((key) => {
      if (key != "color" && key != "size" && key != "anchor" && result[key] === void 0)
        result[key] = defaults[key];
    });
    return result;
  }
  function getNormalizedLineOptions({
    visible: visible2 = void 0,
    style = {},
    ...result
  } = {}, defaults = {}) {
    result.visible = getFirstDefinedValue(visible2, defaults.visible, true);
    result.style = getNormalizedLineStyleOptions(style, defaults.style);
    Object.keys(defaults).forEach((key) => {
      if (key != "visible" && key != "style" && result[key] === void 0)
        result[key] = defaults[key];
    });
    return result;
  }
  function getNormalizedTextOptions({
    visible: visible2 = true,
    font = {},
    ...result
  } = {}, defaults = {}) {
    result.visible = getFirstDefinedValue(visible2, defaults.visible, true);
    result.font = getNormalizedFontOptions(font, defaults.font);
    Object.keys(defaults).forEach((key) => {
      if (key != "visible" && key != "font" && result[key] === void 0)
        result[key] = defaults[key];
    });
    return result;
  }
  function updateLineOptions(options = {}, updateOptions = {}) {
    if ("visible" in updateOptions)
      options.visible = updateOptions.visible;
    if ("style" in updateOptions) {
      ["color", "width", "opacity", "linecap", "linejoin", "dasharray"].forEach((styleKey) => {
        if (styleKey in updateOptions.style)
          options.style[styleKey] = updateOptions.style[styleKey];
      });
    }
    return options;
  }
  function getFirstDefinedValue(...params) {
    return params.reduce((acc, cur) => {
      return acc !== void 0 ? acc : cur;
    });
  }
  function drawTextInto({
    node,
    text,
    x: x5,
    y: y5,
    horizontalMargin = 0,
    verticalMargin = 0,
    font = {},
    fill = void 0
  }) {
    const group = node.group();
    let background = void 0;
    if (fill !== void 0) {
      if (!("color" in fill))
        fill.color = "white";
      background = group.rect().fill(fill);
    }
    const f = { ...font };
    let fontColor = void 0;
    if ("color" in f) {
      fontColor = f.color;
      delete f.color;
    }
    const textNode = group.text(text).attr({ x: x5, y: y5 }).font(font);
    if (fontColor !== void 0)
      textNode.fill(fontColor);
    if (font["alignment-baseline"] == "bottom")
      textNode.dy(-textNode.bbox().height - 5);
    textNode.dx(horizontalMargin * (textNode.attr("text-anchor") == "end" ? -1 : 1)).dy(verticalMargin * (font["alignment-baseline"] == "bottom" ? -1 : 1));
    if (background !== void 0)
      background.attr({
        x: textNode.bbox().x,
        y: textNode.bbox().y,
        width: textNode.bbox().width,
        height: textNode.bbox().height
      });
    return group;
  }
  function drawWindbarbInto({
    node,
    x: x5 = 0,
    y: y5 = 0,
    wspd = 0,
    wdir = 270,
    length: length2 = 50,
    strokeStyle = void 0,
    fillTriangle = true,
    triangleRatio = 1 / 5,
    barbDistanceRatio = 1 / 10,
    barbHeightRatio = 3 / 8,
    circleOnLowWindspeed = true,
    circleRadiusRatio = 1 / 10
  } = {}) {
    strokeStyle = getNormalizedLineStyleOptions(strokeStyle);
    const windspeed = windspeedMSToKN(wspd);
    const windbarbGroup = node.group();
    const barbGroup = windspeed >= 5 ? windbarbGroup.group() : void 0;
    const triangleWidth = length2 * triangleRatio;
    const barbDistance = length2 * barbDistanceRatio;
    const windbarbHeight = length2 * barbHeightRatio;
    let yPosition = y5 - length2;
    let windspeedResidual = windspeed;
    if (windspeed < 5 && circleOnLowWindspeed) {
      windbarbGroup.circle(length2 * circleRadiusRatio).cx(x5).cy(y5).stroke(strokeStyle).fill("none");
      return;
    }
    windbarbGroup.line(x5, yPosition, x5, y5).stroke(strokeStyle);
    while (windspeedResidual >= 50) {
      barbGroup.polyline([
        [x5, yPosition],
        [x5 + windbarbHeight, yPosition + triangleWidth / 2],
        [x5, yPosition + triangleWidth]
      ]).fill(fillTriangle ? strokeStyle : "none").stroke(strokeStyle);
      windspeedResidual -= 50;
      yPosition += triangleWidth + (windspeedResidual >= 50 ? barbDistance / 2 : barbDistance);
    }
    while (windspeedResidual >= 10) {
      barbGroup.line(
        x5,
        yPosition,
        x5 + windbarbHeight,
        yPosition - triangleWidth / 2
      ).stroke(strokeStyle);
      yPosition += barbDistance;
      windspeedResidual -= 10;
    }
    if (windspeed < 10)
      yPosition += barbDistance;
    if (windspeedResidual >= 5)
      barbGroup.line(
        x5,
        yPosition,
        x5 + windbarbHeight / 2,
        yPosition - triangleWidth / 4
      ).stroke(strokeStyle);
    const barbsWidth = yPosition - (y5 - length2);
    if (barbsWidth > length2 * 0.9)
      barbGroup.scale(1, length2 * 0.9 / barbsWidth, x5, y5 - length2);
    if (wdir != 0)
      windbarbGroup.rotate(wdir, x5, y5);
  }

  // node_modules/meteojs/thermodynamicDiagram/DiagramParcel.js
  var DiagramParcel = class extends Unique_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~options} [options] - Options.
     */
    constructor({
      parcel = void 0,
      visible: visible2 = true,
      temp = {},
      dewp = {},
      ...rest
    } = {}) {
      super(rest);
      this._parcel = parcel;
      if (this.id === void 0 && parcel !== void 0)
        this.id = parcel.id;
      this._options = {
        visible: visible2,
        temp: getNormalizedLineOptions(temp, {
          style: {
            color: "rgb(255, 153, 0)",
            width: 3,
            linecap: "round"
          }
        }),
        dewp: getNormalizedLineOptions(dewp, {
          style: {
            color: "rgb(255, 153, 0)",
            width: 3,
            linecap: "round"
          }
        })
      };
    }
    /**
     * Parcel object.
     * 
     * @type module:meteoJS/sounding/parcel.Parcel
     * @readonly
     */
    get parcel() {
      return this._parcel;
    }
    /**
     * Visibility of the parcel.
     * 
     * @type {boolean}
     * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
     */
    get visible() {
      return this._options.visible;
    }
    set visible(visible2) {
      let oldVisible = this._options.visible;
      this._options.visible = visible2 ? true : false;
      if (oldVisible != this._options.visible)
        this.trigger("change:visible");
    }
    /**
     * Style options for the parcel.
     * 
     * @type {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
     * @readonly
     */
    get options() {
      return this._options;
    }
    /**
     * Updates the style options for the parcel.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
     *   [options] - Options.
     * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
     * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:options
     */
    update({
      visible: visible2 = void 0,
      temp = void 0,
      dewp = void 0
    } = {}) {
      let willTrigger = false;
      if (temp === void 0)
        temp = {};
      else
        willTrigger = true;
      if (dewp === void 0)
        dewp = {};
      else
        willTrigger = true;
      this._options.temp = updateLineOptions(this._options.temp, temp);
      this._options.dewp = updateLineOptions(this._options.dewp, dewp);
      if (willTrigger)
        this.trigger("change:options");
      if (visible2 !== void 0)
        this.visible = visible2;
    }
  };
  Events_default(DiagramParcel.prototype);
  var DiagramParcel_default = DiagramParcel;

  // node_modules/meteojs/thermodynamicDiagram/DiagramSounding.js
  var DiagramSounding = class extends Unique_default {
    /**
     * @param {module:meteoJS/sounding.Sounding} sounding - Sounding data.
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options} [options] - Options.
     */
    constructor(sounding, {
      visible: visible2 = true,
      diagram = {},
      windprofile = {},
      hodograph = {},
      parcels = {}
    } = {}) {
      super();
      this._sounding = sounding;
      this._diagramParcelCollection = new Collection_default({
        fireReplace: false,
        fireAddRemoveOnReplace: true,
        emptyObjectMaker: () => new DiagramParcel_default()
      });
      this._visible = visible2;
      this._options = {
        diagram: getNormalizedDiagramOptions(diagram),
        windprofile: getNormalizedWindprofileOptions(windprofile),
        hodograph: getNormalizedHodographOptions(hodograph),
        parcels: getNormalizedParcelsOptions(parcels)
      };
      if (this._sounding !== void 0) {
        this._sounding.parcelCollection.on(
          "add:item",
          (parcel) => this.addParcel(parcel)
        );
        this._sounding.parcelCollection.on("remove:item", (parcel) => {
          for (let diagramParcel of this._diagramParcelCollection)
            if (diagramParcel.parcel === parcel)
              this._diagramParcelCollection.remove(diagramParcel);
        });
        for (let parcel of this._sounding.parcelCollection)
          this.addParcel(parcel);
      }
    }
    /**
     * Sounding data.
     * 
     * @type module:meteoJS/sounding.Sounding
     * @readonly
     */
    get sounding() {
      return this._sounding;
    }
    /**
     * Visibility of the sounding.
     * 
     * @type {boolean}
     * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
     */
    get visible() {
      return this._visible;
    }
    set visible(visible2) {
      let oldVisible = this._visible;
      this._visible = visible2 ? true : false;
      if (oldVisible != this._visible)
        this.trigger("change:visible");
    }
    get options() {
      return this._options;
    }
    /**
     * Collection of the DiagramParcel objects.
     * 
     * @type module:meteoJS/base/collection.Collection
     * @readonly
     */
    get diagramParcelCollection() {
      return this._diagramParcelCollection;
    }
    /**
     * Add a parcel with styles to the sounding.
     * (analogue to {@link module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable#addSounding})
     * 
     * @param {module:meteoJS/sounding/parcel.Parcel} parcel - Parcel object.
     * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
     *   [options] - Style options.
     * @returns {module:meteoJS/thermodynamicDiagram/diagramParcel.diagramParcel}
     *   Parcel object for the diagram with style options.
     */
    addParcel(parcel, options = void 0) {
      options = options === void 0 ? this.getParcelOptions(parcel) : options;
      options.parcel = parcel;
      const dp = new DiagramParcel_default(options);
      this._diagramParcelCollection.append(dp);
      return dp;
    }
    /**
     * Updated the style options for this sounding.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options}
     *   [options] - Options.
     * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
     * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:options
     */
    update({
      visible: visible2 = void 0,
      diagram = void 0,
      windprofile = void 0,
      hodograph = void 0,
      parcels = void 0
    } = {}) {
      let willTrigger = false;
      if (diagram === void 0)
        diagram = {};
      else
        willTrigger = true;
      if (windprofile === void 0)
        windprofile = {};
      else
        willTrigger = true;
      if (hodograph === void 0)
        hodograph = {};
      else
        willTrigger = true;
      this._options.diagram = updateDiagramOptions(this._options.diagram, diagram);
      this._options.windprofile = updateWindprofileOptions(this._options.windprofile, windprofile);
      this._options.hodograph = updateHodographOptions(this._options.hodograph, hodograph);
      if (willTrigger)
        this.trigger("change:options");
      if (parcels === void 0)
        parcels = {};
      this._options.parcels = updateParcelsOptions(this._options.parcels, parcels);
      for (let diagramParcel of this.diagramParcelCollection) {
        if (diagramParcel.id in parcels)
          diagramParcel.update(parcels[diagramParcel.id]);
      }
      if (visible2 !== void 0)
        this.visible = visible2;
    }
    /**
     * Returns normalized visibility and style options for a parcel. This is a
     * combination of the specific options for the passed parcel and the defaults.
     * 
     * @param {module:meteoJS/sounding/parcel.Parcel} [parcel] - Parcel.
     * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
     *   Parcel options.
     * @public
     */
    getParcelOptions(parcel = void 0) {
      let result = {
        visible: this.options.parcels.default.visible,
        temp: {
          visible: this.options.parcels.default.temp.visible,
          style: {}
        },
        dewp: {
          visible: this.options.parcels.default.dewp.visible,
          style: {}
        }
      };
      ["temp", "dewp"].forEach((key) => {
        Object.keys(this.options.parcels.default[key].style).forEach((styleKey) => {
          result[key].style[styleKey] = this.options.parcels.default[key].style[styleKey];
        });
      });
      if (parcel !== void 0 && parcel.id in this.options.parcels)
        result = updateOptionsPart(
          result,
          this.options.parcels[parcel.id],
          ["temp", "dewp"]
        );
      return result;
    }
  };
  Events_default(DiagramSounding.prototype);
  var DiagramSounding_default = DiagramSounding;
  function getNormalizedDiagramOptions({
    visible: visible2 = true,
    temp = {},
    dewp = {},
    wetbulb = {}
  } = {}) {
    return {
      visible: visible2,
      temp: getNormalizedLineOptions(temp, {
        style: {
          color: "red",
          width: 3,
          linecap: "round"
        }
      }),
      dewp: getNormalizedLineOptions(dewp, {
        style: {
          color: "blue",
          width: 3,
          linecap: "round"
        }
      }),
      wetbulb: getNormalizedLineOptions(wetbulb, {
        style: {
          color: "green",
          width: 2,
          linecap: "round"
        }
      })
    };
  }
  function updateDiagramOptions(options, updateOptions) {
    return updateOptionsPart(options, updateOptions, ["temp", "dewp", "wetbulb"]);
  }
  function getNormalizedWindprofileOptions({
    visible: visible2 = true,
    windbarbs = {},
    windspeed = {}
  } = {}) {
    return {
      visible: visible2,
      windbarbs: getNormalizedLineOptions(windbarbs),
      windspeed: getNormalizedLineOptions(windspeed)
    };
  }
  function updateWindprofileOptions(options, updateOptions) {
    return updateOptionsPart(options, updateOptions, ["windbarbs", "windspeed"]);
  }
  function getNormalizedHodographOptions({
    minPressure = void 0,
    maxPressure = void 0,
    segments = [],
    ...result
  } = {}) {
    result = getNormalizedLineOptions(result, {
      style: {
        color: "green",
        width: 2
      }
    });
    result.minPressure = minPressure;
    result.maxPressure = maxPressure;
    result.segments = segments.map(({
      minPressure: minPressure2 = void 0,
      maxPressure: maxPressure2 = void 0,
      ...segment
    }) => {
      segment = getNormalizedLineOptions(segment);
      segment.minPressure = minPressure2;
      segment.maxPressure = maxPressure2;
      return segment;
    });
    return result;
  }
  function updateHodographOptions(options, updateOptions) {
    options = updateLineOptions(options, updateOptions);
    ["minPressure", "maxPressure"].forEach((styleKey) => {
      if (styleKey in updateOptions)
        options[styleKey] = updateOptions[styleKey];
    });
    if ("segments" in updateOptions)
      options.segments = updateOptions.segments.map(({
        minPressure = void 0,
        maxPressure = void 0,
        ...segment
      }) => {
        segment = getNormalizedLineOptions(segment);
        segment.minPressure = minPressure;
        segment.maxPressure = maxPressure;
        return segment;
      });
    return options;
  }
  function getNormalizedParcelsOptions(options = {}) {
    if (options.visible === void 0)
      options.visible = true;
    if (options.default === void 0)
      options.default = {};
    if (options.default.visible === void 0)
      options.default.visible = false;
    if (options.default.temp === void 0)
      options.default.temp = {};
    if (options.default.temp.visible === void 0)
      options.default.temp.visible = true;
    if (options.default.temp.style === void 0)
      options.default.temp.style = {};
    if (options.default.temp.style.color === void 0)
      options.default.temp.style.color = "rgb(255, 153, 0)";
    if (options.default.temp.style.width === void 0)
      options.default.temp.style.width = 3;
    if (options.default.temp.style.linecap === void 0)
      options.default.temp.style.linecap = "round";
    if (options.default.dewp === void 0)
      options.default.dewp = {};
    if (options.default.dewp.visible === void 0)
      options.default.dewp.visible = true;
    if (options.default.dewp.style === void 0)
      options.default.dewp.style = {};
    if (options.default.dewp.style.color === void 0)
      options.default.dewp.style.color = "rgb(255, 194, 102)";
    if (options.default.dewp.style.width === void 0)
      options.default.dewp.style.width = 3;
    if (options.default.dewp.style.linecap === void 0)
      options.default.dewp.style.linecap = "round";
    return options;
  }
  function updateParcelsOptions(options, updateOptions) {
    if ("visible" in updateOptions)
      options.visible = updateOptions.visible;
    if ("default" in updateOptions)
      options.default = updateOptionsPart(
        options.default,
        updateOptions.default,
        ["temp", "dewp"]
      );
    Object.keys(updateOptions).filter((key) => key != "visible" && key != "default").forEach((key) => options[key] = updateDiagramOptions(
      key in options ? options[key] : {},
      updateOptions[key]
    ));
    return options;
  }
  function updateOptionsPart(options, updateOptions, lineKeys = []) {
    if ("visible" in updateOptions)
      options.visible = updateOptions.visible;
    lineKeys.forEach((key) => {
      if (key in updateOptions)
        options[key] = updateLineOptions(options[key] ? options[key] : { style: {} }, updateOptions[key]);
    });
    return options;
  }

  // node_modules/meteojs/ThermodynamicDiagramPluggable.js
  var ThermodynamicDiagramPluggable = class extends Collection_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram~options} options - Options.
     */
    constructor({
      renderTo = void 0,
      width: width4 = void 0,
      height: height4 = void 0
    } = {}) {
      super({
        fireReplace: false,
        fireAddRemoveOnReplace: true,
        emptyObjectMaker: () => new DiagramSounding_default()
      });
      this._svgNode = renderTo === void 0 || "node" in renderTo || "instance" in renderTo ? SVG(renderTo) : SVG().addTo(renderTo);
      if (width4 !== void 0 || height4 !== void 0)
        this._svgNode.size(width4, height4);
      else if (width4 === void 0 && height4 === void 0 && renderTo !== void 0 && "getBoundingClientRect" in renderTo) {
        let boundingRect = renderTo.getBoundingClientRect();
        let computedStyle = window.getComputedStyle(renderTo);
        this._svgNode.size(
          boundingRect.width - parseFloat(computedStyle.getPropertyValue("padding-left")) - parseFloat(computedStyle.getPropertyValue("padding-right")),
          boundingRect.height - parseFloat(computedStyle.getPropertyValue("padding-top")) - parseFloat(computedStyle.getPropertyValue("padding-bottom"))
        );
      }
      this._plotAreas = /* @__PURE__ */ new Set();
      this._svgNode.on("mousemove", (e) => {
        for (let plotArea of this._plotAreas)
          if ("isHoverLabelsRemote" in plotArea)
            plotArea.svgNode.dispatchEvent(e);
      });
      this._svgNode.on("mouseout", (e) => {
        if (this._svgNode.node === e.target) {
          for (let plotArea of this._plotAreas)
            if ("_hoverLabelsGroup" in plotArea)
              plotArea._hoverLabelsGroup.clear();
        }
      });
      this.on("add:item", (sounding) => {
        for (let plotArea of this._plotAreas)
          if ("addSounding" in plotArea)
            plotArea.addSounding(sounding);
      });
      this.on("remove:item", (sounding) => {
        for (let plotArea of this._plotAreas)
          if ("removeSounding" in plotArea)
            plotArea.removeSounding(sounding);
      });
    }
    /**
     * SVG object of the complete diagram.
     * 
     * @type external:SVG
     * @readonly
     */
    get svgNode() {
      return this._svgNode;
    }
    /**
     * Appends a PlotArea object to this thermodynamic diagram.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/plotArea.PlotArea} plotArea
     *   PlotArea object.
     * @returns {module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable}
     *   This.
     */
    appendPlotArea(plotArea) {
      if (this._plotAreas.has(plotArea))
        return;
      this._plotAreas.add(plotArea);
      plotArea.addTo(this.svgNode);
      plotArea.onCoordinateSystemChange();
      for (let sounding of this)
        if ("addSounding" in plotArea)
          plotArea.addSounding(sounding);
      return this;
    }
    /**
     * Removes a PlotArea object from this thermodynamic diagram.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/plotArea.PlotArea} plotArea
     *   PlotArea object.
     * @returns {module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable}
     *   This.
     */
    removePlotArea(plotArea) {
      if (!this._plotAreas.has(plotArea))
        return;
      for (let sounding of this)
        plotArea.removeSounding(sounding);
      this._plotAreas.delete(plotArea);
      return this;
    }
    /**
     * Exchanges the coordinate system in the PlotArea objects. The optional,
     * second argument defines an already used coordinate system. If this
     * argument is passed, only the coordinate system of the PlotArea's with
     * this coordinate system will exchanged.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
     *   coordinateSystem - Coordinate system.
     * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
     *   [formerCoordinateSystem=undefined] - Coordinate system.
     */
    exchangeCoordinateSystem(coordinateSystem, formerCoordinateSystem = void 0) {
      for (let plotArea of this._plotAreas)
        if (formerCoordinateSystem === void 0 || plotArea.coordinateSystem === formerCoordinateSystem)
          plotArea.coordinateSystem = coordinateSystem;
    }
    /**
     * Add a sounding to the diagram.
     * 
     * @param {module:meteoJS/sounding.Sounding} sounding - Sounding object.
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options}
     *   [options] - Display options.
     * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   Sounding object for the diagram with display options.
     */
    addSounding(sounding, options = {}) {
      let diagramSounding = new DiagramSounding_default(sounding, options);
      let i = 1;
      let id = `sounding-${i}`;
      while (this.containsId(id)) {
        i++;
        id = `sounding-${i}`;
      }
      diagramSounding.id = id;
      this.append(diagramSounding);
      return diagramSounding;
    }
  };
  var ThermodynamicDiagramPluggable_default = ThermodynamicDiagramPluggable;

  // node_modules/meteojs/thermodynamicDiagram/CoordinateSystem.js
  var CoordinateSystem = class {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~options} options
     */
    constructor({
      width: width4 = 100,
      height: height4 = 100,
      pressure = {},
      temperature = {}
    } = {}) {
      this._width = width4;
      this._height = height4;
      this.temperatureBottomLeft;
      this.temperatureBottomRight;
      this.inclinationTan;
      this.options = {
        pressure: {},
        temperature: {}
      };
      this._initPressureOptions(pressure);
      this._initTemperatureOptions(temperature);
    }
    /**
     * Visible width, in pixels.
     * 
     * @type integer
     * @public
     */
    get width() {
      return this._width;
    }
    set width(width4) {
      const oldWidth = this._width;
      this._width = width4;
      if (oldWidth != this._width)
        this.trigger("change:options");
    }
    /**
     * Visible height, in pixels.
     * 
     * @type integer
     * @public
     */
    get height() {
      return this._height;
    }
    set height(height4) {
      const oldHeight = this._height;
      this._height = height4;
      if (oldHeight != this._height)
        this.trigger("change:options");
    }
    /**
     * Returns if isobars are straight lines in the defined coordinate system.
     * 
     * @returns {boolean}
     */
    isIsobarsStraightLine() {
      return true;
    }
    /**
     * Returns if the dry adiabats are straight lines
     * in the defined coordinate system.
     * 
     * @returns {boolean}
     */
    isDryAdiabatStraightLine() {
      return false;
    }
    /**
     * @returns {boolean}
     */
    isIsothermsVertical() {
      return this.options.temperature.inclinationAngle !== void 0 && this.options.temperature.inclinationAngle == 0;
    }
    /**
     * Pressure for a x-y coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} y - Pixels from bottom.
     * @returns {number} Pressure in hPa.
     */
    getPByXY(x5, y5) {
      return Math.pow(this.options.pressure.min, y5 / this.height) * Math.pow(
        this.options.pressure.max,
        (this.height - y5) / this.height
      );
    }
    /**
     * Temperature for x-y coordinate.
     * Implementation valid for straight isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} y - Pixels from bottom.
     * @returns {number} Temperature in Kelvin.
     */
    getTByXY(x5, y5) {
      let x0 = x5 - y5 * this.inclinationTan;
      return this.temperatureBottomLeft + x0 * (this.temperatureBottomRight - this.temperatureBottomLeft) / this.width;
    }
    /**
     * y coordinate for pressure and x coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} p - Pressure in hPa.
     * @returns {number} Pixels from bottom.
     */
    getYByXP(x5, p) {
      return this.height * Math.log(this.options.pressure.max / p) / Math.log(this.options.pressure.max / this.options.pressure.min);
    }
    /**
     * Temperature for pressure and x coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} p - Pressure in hPa.
     * @returns {number} Temperature in Kelvin.
     */
    getTByXP(x5, p) {
      return this.getTByXY(x5, this.getYByXP(x5, p));
    }
    /**
     * x coordinate for temperature and y coordinate.
     * Implementation valid for straight isotherms.
     * 
     * @param {number} y - Pixels from bottom.
     * @param {number} T - Temperature in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByYT(y5, T) {
      let x0 = (T - this.temperatureBottomLeft) * this.width / (this.temperatureBottomRight - this.temperatureBottomLeft);
      return x0 + y5 * this.inclinationTan;
    }
    /**
     * y coordinate for temperature and x coordinate.
     * Implementation valid for straight isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} T - Temperature in Kelvin.
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByXT(x5, T) {
      return this.inclinationTan != 0 ? (x5 - this.getXByYT(0, T)) / this.inclinationTan : void 0;
    }
    /**
     * x coordinate for pressure and temperature.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} T - Temperature in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByPT(p, T) {
      return this.getXByYT(this.getYByXP(0, p), T);
    }
    /**
     * y coordinate for pressure and temperature.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} T - Temperature in Kelvin.
     * @returns {number} Pixels from bottom.
     */
    getYByPT(p) {
      return this.getYByXP(0, p);
    }
    /**
     * x coordinate for potential temperature and y coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} y - Pixels from bottom.
     * @param {number} T - Potential temperature in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByYPotentialTemperature(y5, T) {
      T = tempByPotentialTempAndPres(T, this.getPByXY(0, y5));
      return this.getXByYT(y5, T);
    }
    /**
     * y coordinate for potential temperature and x coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} T - Potential temperature in Kelvin.
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByXPotentialTemperature(x5, T) {
      let a = this.getPByXY(x5, 0);
      let b = this.getPByXY(x5, this.height);
      if (potentialTempByTempAndPres(this.getTByXP(x5, b), b) < T || T < potentialTempByTempAndPres(this.getTByXP(x5, a), a))
        return void 0;
      while (a - b > 10) {
        let p = b + (a - b) / 2;
        let tBin = this.getTByXP(x5, p);
        let potTemp = potentialTempByTempAndPres(tBin, p);
        if (potTemp === void 0)
          return void 0;
        if (potTemp < T)
          a = p;
        else
          b = p;
      }
      let y5 = this.getYByXP(x5, b + (a - b) / 2);
      return y5;
    }
    /**
     * x coordinate for pressure and potential temperature.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} T - Potential temperature in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByPPotentialTemperatur(p, T) {
      T = tempByPotentialTempAndPres(T, p);
      return this.getXByPT(p, T);
    }
    /**
     * y coordinate for pressure and potential temperature.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} T - Potential temperature in Kelvin.
     * @returns {number} Pixels from bottom.
     */
    getYByPPotentialTemperatur(p, T) {
      let x5 = this.getXByPPotentialTemperatur(p, T);
      return this.getYByXPotentialTemperature(x5, T);
    }
    /**
     * x coordinate for humid mixing ratio and y coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} y - Pixels from bottom.
     * @param {number} hmr - Humid mixing ratio. []
     * @returns {number} Pixels from the left.
     */
    getXByYHMR(y5, hmr) {
      let p = this.getPByXY(0, y5);
      return this.getXByYT(y5, dewpointByHMRAndPres(hmr, p));
    }
    /**
     * y coordinate for humid mixing ratio and x coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} hmr - Humid mixing ratio. []
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByXHMR(x5, hmr) {
      let a = this.getPByXY(x5, 0);
      let b = this.getPByXY(x5, this.height);
      while (a - b > 10) {
        let p = b + (a - b) / 2;
        let hmrp = saturationHMRByTempAndPres(this.getTByXP(x5, p), p);
        if (hmrp === void 0)
          return void 0;
        if (hmrp < hmr)
          b = p;
        else
          a = p;
      }
      let y5 = this.getYByXP(x5, b + (a - b) / 2);
      return y5;
    }
    /**
     * x coordinate for pressure and humid mixing ratio.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} hmr - Humid mixing ratio. []
     * @returns {number} Pixels from the left.
     */
    getXByPHMR(p, hmr) {
      let dewpoint = dewpointByHMRAndPres(hmr, p);
      return this.getXByPT(p, dewpoint);
    }
    /**
     * y coordinate for pressure and humid mixing ratio.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} hmr - Humid mixing ratio. []
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByPHMR(p, hmr) {
      let dewpoint = dewpointByHMRAndPres(hmr, p);
      return this.getYByPT(p, dewpoint);
    }
    /**
     * x coordinate for equipotential temperature and y coordainte.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} y - Pixels from bottom.
     * @param {number} thetae - Equipotential temperaturen in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByYEquiPotTemp(y5, thetae) {
      let T = tempByEquiPotTempAndPres(thetae, this.getPByXY(0, y5));
      return this.getXByYT(y5, T);
    }
    /**
     * y coordinate for equipotential temperature and x coordinate.
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} x - Pixels from the left.
     * @param {number} thetae - Equipotential temperaturen in Kelvin.
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByXEquiPotTemp(x5, thetae) {
      let a = 0;
      let b = this.height;
      let y5 = void 0;
      while (b - a > 10) {
        y5 = a + (b - a) / 2;
        let thetaEY = this.getYByXT(
          x5,
          tempByEquiPotTempAndPres(thetae, this.getPByXY(x5, y5))
        );
        if (thetaEY === void 0)
          return void 0;
        if (thetaEY < thetae)
          b = y5;
        else
          a = y5;
      }
      return y5;
    }
    /**
     * x coordinate for pressure and equipotential temperature .
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} thetae - Equipotential temperaturen in Kelvin.
     * @returns {number} Pixels from the left.
     */
    getXByPEquiPotTemp(p, thetae) {
      let T = tempByEquiPotTempAndPres(thetae, p);
      return this.getXByPT(p, T);
    }
    /**
     * y coordinate for pressure and equipotential temperature .
     * Implementation valid for horizontal isobars, log-P y-axes and straight
     * isotherms.
     * 
     * @param {number} p - Pressure in hPa.
     * @param {number} thetae - Equipotential temperaturen in Kelvin.
     * @returns {number|undefined} Pixels from bottom.
     */
    getYByPEquiPotTemp(p, thetae) {
      let T = tempByEquiPotTempAndPres(thetae, p);
      return this.getYByPT(p, T);
    }
    /**
     * Updates options. To restore a default value, pass undefined.
     * 
     * @param {Object} [options] - Options.
     * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~pressureOptions}
     *   [options.pressure] - Pressure options.
     * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~temperatureOptions}
     *   [options.temperature] - Temperature options.
     */
    update({
      pressure = {},
      temperature = {}
    } = {}) {
      if ("min" in pressure)
        this.options.pressure.min = pressure.min === void 0 ? 100 : pressure.min;
      if ("max" in pressure)
        this.options.pressure.max = pressure.max === void 0 ? 1e3 : pressure.max;
      if ("min" in temperature)
        this.options.temperature.min = temperature.min === void 0 ? tempCelsiusToKelvin(-40) : temperature.min;
      if ("max" in temperature)
        this.options.temperature.max = temperature.max === void 0 ? tempCelsiusToKelvin(-45) : temperature.max;
      if ("reference" in temperature)
        this.options.temperature.reference = temperature.reference === void 0 ? "base" : temperature.reference;
      if ("inclinationAngle" in temperature)
        this.options.temperature.inclinationAngle = temperature.inclinationAngle === void 0 ? 45 : temperature.inclinationAngle;
      this._normalizeTemperatureRange();
      this.trigger("change:options");
    }
    /**
     * @private
     */
    _initPressureOptions({
      min = 100,
      max = 1050
    }) {
      this.options.pressure = {
        min,
        max
      };
    }
    /**
     * @private
     */
    _initTemperatureOptions({
      min = tempCelsiusToKelvin(-40),
      max = tempCelsiusToKelvin(45),
      reference: reference2 = "base",
      inclinationAngle = 45
    }) {
      this.options.temperature = {
        min,
        max,
        reference: reference2,
        inclinationAngle
      };
      this._normalizeTemperatureRange();
    }
    /**
     * @internal
     */
    _normalizeTemperatureRange() {
      this.temperatureBottomLeft = this.options.temperature.min;
      this.temperatureBottomRight = this.options.temperature.max;
      this.inclinationTan = this.options.temperature.inclinationAngle == 45 ? 1 : this.options.temperature.inclinationAngle == 0 ? 0 : Math.tan(this.options.temperature.inclinationAngle * Math.PI / 180);
      if (/^[0-9]+$/.test(this.options.temperature.reference)) {
        let yReference = this.getYByXP(0, this.options.temperature.reference);
        let xTmin = this.inclinationTan * yReference;
        let deltaT = (this.temperatureBottomRight - this.temperatureBottomLeft) / this.width;
        this.temperatureBottomLeft += deltaT * xTmin;
        this.temperatureBottomRight += deltaT * xTmin;
      }
    }
  };
  Events_default(CoordinateSystem.prototype);
  var CoordinateSystem_default = CoordinateSystem;

  // node_modules/meteojs/thermodynamicDiagram/coordinateSystem/StueveDiagram.js
  var k = 0.2857;
  var StueveDiagram = class extends CoordinateSystem_default {
    /**
     * @inheritdoc
     */
    constructor({
      width: width4 = 100,
      height: height4 = 100,
      pressure = {},
      temperature = {}
    } = {}) {
      temperature.inclinationAngle = 0;
      super({
        width: width4,
        height: height4,
        pressure,
        temperature
      });
    }
    /**
     * @inheritdoc
     */
    isDryAdiabatStraightLine() {
      return true;
    }
    /**
     * @inheritdoc
     */
    getPByXY(x5, y5) {
      return Math.pow(
        Math.pow(this.options.pressure.max, k) - y5 * (Math.pow(this.options.pressure.max, k) - Math.pow(this.options.pressure.min, k)) / this.height,
        1 / k
      );
    }
    /**
     * @inheritdoc
     */
    getYByXP(x5, p) {
      return this.height * (Math.pow(this.options.pressure.max, k) - Math.pow(p, k)) / (Math.pow(this.options.pressure.max, k) - Math.pow(this.options.pressure.min, k));
    }
    /**
     * @inheritdoc
     */
    getYByXT() {
      return void 0;
    }
  };
  var StueveDiagram_default = StueveDiagram;

  // node_modules/meteojs/thermodynamicDiagram/coordinateSystem/Emagram.js
  var Emagram = class extends CoordinateSystem_default {
    /**
     * @inheritdoc
     */
    constructor({
      width: width4 = 100,
      height: height4 = 100,
      pressure = {},
      temperature = {}
    } = {}) {
      temperature.inclinationAngle = 0;
      super({
        width: width4,
        height: height4,
        pressure,
        temperature
      });
    }
  };
  var Emagram_default = Emagram;

  // node_modules/meteojs/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js
  var SkewTlogPDiagram = class extends CoordinateSystem_default {
  };
  var SkewTlogPDiagram_default = SkewTlogPDiagram;

  // node_modules/meteojs/thermodynamicDiagram/PlotArea.js
  var PlotArea = class {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/plotArea~options}
     *   options - Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = 0,
      y: y5 = 0,
      width: width4 = 100,
      height: height4 = 100,
      style = {},
      visible: visible2 = true,
      events = {}
    } = {}) {
      this._svgNode = SVG().attr({
        x: x5,
        y: y5,
        width: width4,
        height: height4
      }).css(this._getNormalizedStyle(style)).css("display", visible2 ? "inline" : "none");
      if (svgNode !== void 0)
        this.addTo(svgNode);
      this._svgNodeBackground = this._svgNode.group();
      this._visible = visible2;
      this._coordinateSystem = coordinateSystem;
      this._coordinateSystemListenerKey = this._coordinateSystem !== void 0 ? this._coordinateSystem.on("change:options", () => this.onCoordinateSystemChange()) : void 0;
      this.on("change:extent", () => this.onCoordinateSystemChange());
      this._initEvents(events);
    }
    /**
     * SVG container node.
     * 
     * @type external:SVG
     * @public
     * @readonly
     */
    get svgNode() {
      return this._svgNode;
    }
    /**
     * Visibility of the area.
     * 
     * @type boolean
     * @public
     */
    get visible() {
      return this._visible;
    }
    set visible(visible2) {
      let oldVisible = this._visible;
      this._visible = visible2;
      if (oldVisible != this._visible) {
        this._svgNode.style("display", this._visible ? "inline" : "none");
        this.trigger("change:visible");
      }
    }
    /**
     * X of the top-left edge.
     * 
     * @type integer
     * @public
     */
    get x() {
      return this._svgNode.attr("x");
    }
    set x(x5) {
      this._svgNode.attr({ x: x5 });
      this.trigger("change:position");
    }
    /**
     * Y of the top-left edge.
     * 
     * @type integer
     * @public
     */
    get y() {
      return this._svgNode.attr("y");
    }
    set y(y5) {
      this._svgNode.attr({ y: y5 });
      this.trigger("change:position");
    }
    /**
     * Width of the area.
     * 
     * @type integer
     * @public
     */
    get width() {
      return this._svgNode.attr("width");
    }
    set width(width4) {
      this._svgNode.attr({ width: width4 });
      this.trigger("change:extent");
    }
    /**
     * Height of the area.
     * 
     * @type integer
     * @public
     */
    get height() {
      return this._svgNode.attr("height");
    }
    set height(height4) {
      this._svgNode.attr({ height: height4 });
      this.trigger("change:extent");
    }
    /**
     * Overflow-style of the area.
     * 
     * @type string
     * @public
     */
    get style() {
      return this._svgNode.css();
    }
    set style(style) {
      this._svgNode.css(style);
    }
    /**
     * Coordinate system.
     * 
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @public
     */
    get coordinateSystem() {
      return this._coordinateSystem;
    }
    set coordinateSystem(coordinateSystem) {
      if (this._coordinateSystemListenerKey !== void 0)
        this._coordinateSystem.un("change:options", this._coordinateSystemListenerKey);
      this._coordinateSystem = coordinateSystem;
      this._coordinateSystemListenerKey = this._coordinateSystem.on("change:options", () => this.onCoordinateSystemChange());
      this.onCoordinateSystemChange();
    }
    /**
     * Minimal extent length (either width or height).
     * 
     * @type integer
     * @readonly
     */
    get minExtentLength() {
      return Math.min(this.width, this.height);
    }
    /**
     * Maximal extent length (either width or height).
     * 
     * @type integer
     * @readonly
     */
    get maxExtentLength() {
      return Math.max(this.width, this.height);
    }
    /**
     * Sets the plot area as a child of the argument.
     * 
     * @param {external:SVG} svgNode - SVG node.
     */
    addTo(svgNode) {
      this._svgNode.addTo(svgNode);
    }
    /**
     * Init the area.
     * 
     * @protected
     */
    init() {
      this.onCoordinateSystemChange();
    }
    /**
     * Called, when the coordinateSystem object changes.
     * 
     * @protected
     */
    onCoordinateSystemChange() {
      if (this._coordinateSystem !== void 0)
        this.drawBackground(this._svgNodeBackground);
    }
    /**
     * Draw background into SVG group.
     * 
     * This method is only called, when this.coordinateSystem isn't undefined.
     * 
     * @param {external:SVG} svgNode - SVG group, SVG.G.
     * @protected
     */
    drawBackground(svgNode) {
      svgNode.clear();
      this.trigger("prebuild:background", { node: svgNode });
      this._drawBackground(svgNode);
      this.trigger("postbuild:background", { node: svgNode });
    }
    /**
     * Method to inherit from child classes to draw the background of the plot
     * area.
     * 
     * This method is only called, when this.coordinateSystem isn't undefined.
     * 
     * @param {external:SVG} svgNode - SVG group, SVG.G.
     * @protected
     */
    _drawBackground() {
    }
    /**
     * Returns normalized SVG style.
     * 
     * @private
     * @param {Object} style - Input SVG style.
     * @param {string} [style.overflow='hidden'] - Overflow style.
     * @returns {Object} - SVG style.
     */
    _getNormalizedStyle({
      overflow = "hidden"
    }) {
      return {
        overflow
      };
    }
    /**
     * Initialize events.
     * 
     * @param {Object} options - Options.
     * @private
     */
    _initEvents({
      click = void 0,
      dblclick = void 0,
      mousedown = void 0,
      mouseup = void 0,
      mouseover = void 0,
      mouseout = void 0,
      mousemove = void 0,
      touchstart = void 0,
      touchmove = void 0,
      touchleave = void 0,
      touchend = void 0,
      touchcancel = void 0
    }) {
      const events = {
        click,
        dblclick,
        mousedown,
        mouseup,
        mouseover,
        mouseout,
        mousemove,
        touchstart,
        touchmove,
        touchleave,
        touchend,
        touchcancel
      };
      Object.keys(events).forEach((eventKey) => {
        this._svgNode.on(eventKey, (e) => {
          const customEvent = this.getExtendedEvent(
            e,
            this._svgNode.point(
              e.pageX - window.pageXOffset,
              e.pageY - window.pageYOffset
            )
          );
          if (events[eventKey] !== void 0)
            events[eventKey].call(this, customEvent);
          this.trigger(eventKey, customEvent);
        });
      });
    }
    /**
     * Extend an event with some properties.
     * 
     * @param {external:Event} e - Event.
     * @param {external:SVG} p - Point.
     * @protected
     */
    getExtendedEvent(e, p) {
      e.elementX = p.x;
      e.elementY = p.y;
      return e;
    }
  };
  Events_default(PlotArea.prototype);
  var PlotArea_default = PlotArea;

  // node_modules/meteojs/thermodynamicDiagram/PlotDataArea.js
  var PlotDataArea = class extends PlotArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
     *   options - Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = 0,
      y: y5 = 0,
      width: width4 = 100,
      height: height4 = 100,
      style = {},
      visible: visible2 = true,
      events = {},
      hoverLabels = {},
      getSoundingVisibility = (sounding) => sounding.visible,
      dataGroupIds = [],
      getCoordinatesByLevelData = () => {
        return { x: void 0, y: void 0 };
      },
      insertDataGroupInto = () => {
      },
      filterDataPoint = void 0,
      minDataPointsDistance = 0
    } = {}) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events
      });
      this._getSoundingVisibility = getSoundingVisibility;
      this._dataGroupIds = dataGroupIds;
      this._getCoordinatesByLevelData = getCoordinatesByLevelData;
      this._insertDataGroupInto = insertDataGroupInto;
      this._filterDataPoint = filterDataPoint;
      this._minDataPointsDistance = minDataPointsDistance;
      this._svgNodeData = this.svgNode.group();
      this._soundings = /* @__PURE__ */ new Map();
      this._hoverLabelsGroup = this.svgNode.group();
      this._getHoverSounding;
      this._initHoverLabels(hoverLabels);
    }
    /**
     * Groups of different data to plot onto the plot area.
     * 
     * @type string[]
     * @readonly
     */
    get dataGroupIds() {
      return this._dataGroupIds;
    }
    /**
     * Returns x and y coordinated of some sounding data.
     * 
     * @type module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData
     * @readonly
     */
    get getCoordinatesByLevelData() {
      return this._getCoordinatesByLevelData;
    }
    /**
     * Minimum distance between data points in pixels.
     * 
     * @type number
     */
    get minDataPointsDistance() {
      return this._minDataPointsDistance;
    }
    set minDataPointsDistance(minDataPointsDistance) {
      const oldValue = this._minDataPointsDistance;
      this._minDataPointsDistance = minDataPointsDistance;
      if (oldValue != this._minDataPointsDistance)
        this.drawSoundings();
    }
    /**
     * The current sounding, for which hover labels should be shown.
     * 
     * @type undefined|module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding
     * @readonly
     * @private
     */
    get hoverLabelsSounding() {
      const soundings = [];
      for (let sounding of this._soundings.keys()) {
        if (this._getSoundingVisibility(sounding))
          soundings.push(sounding);
      }
      if (soundings.length > 0)
        return this._getHoverSounding(soundings);
      return void 0;
    }
    /**
     * Adds a sounding to draw into the area.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding object.
     */
    addSounding(sounding) {
      let group = this._svgNodeData.group();
      let listenerKeyVisible = sounding.on(
        "change:visible",
        () => this.onChangeSoundingVisibility(sounding, group)
      );
      let listenerKeyOptions = sounding.on("change:options", () => {
        if (this.coordinateSystem !== void 0)
          this.drawSounding(sounding, group);
        this.onChangeSoundingVisibility(sounding, group);
      });
      this._soundings.set(sounding, {
        group,
        listenerKeyVisible,
        listenerKeyOptions
      });
      this.trigger("add:sounding", sounding);
      if (this.coordinateSystem !== void 0)
        this.drawSounding(sounding, group);
      this.setDisplayOfSounding(sounding, group);
    }
    /**
     * Removes a sounding from the area.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding object.
     */
    removeSounding(sounding) {
      if (this._soundings.has(sounding)) {
        this._soundings.get(sounding).group.remove();
        sounding.un(this._soundings.get(sounding).listenerKeyVisible);
        sounding.un(this._soundings.get(sounding).listenerKeyOptions);
        this._soundings.delete(sounding);
      }
      this.trigger("remove:sounding", sounding);
    }
    /**
     * Called, when the coordinateSystem object changes.
     * 
     * @override
     */
    onCoordinateSystemChange() {
      super.onCoordinateSystemChange();
      this.drawSoundings();
    }
    /**
     * Called, when a sounding changes its visibilty.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding object.
     * @param {external:SVG} group - SVG group, SVG.G.
     * @protected
     */
    onChangeSoundingVisibility(sounding, group) {
      this.setDisplayOfSounding(sounding, group);
      this._hoverLabelsGroup.clear();
    }
    /**
     * Sets 'display' property of a SVG group of a sounding, depending of the
     * sounding's visibility.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding object.
     * @param {external:SVG} group - SVG group, SVG.G.
     * @protected
     */
    setDisplayOfSounding(sounding, group) {
      group.css(
        "display",
        this._getSoundingVisibility(sounding) ? "inline" : "none"
      );
    }
    /**
     * Draws all soundings.
     * 
     * @protected
     */
    drawSoundings() {
      if (this.coordinateSystem === void 0)
        return;
      for (let sounding of this._soundings.keys())
        this.drawSounding(sounding, this._soundings.get(sounding).group);
    }
    /**
     * Draw the sounding into the SVG group.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding object.
     * @param {external:SVG} group - SVG group, SVG.G.
     * @protected
     */
    drawSounding(sounding, group) {
      group.clear();
      this.trigger("preinsert:sounding", { sounding, node: group });
      const soundingGroup = group.group();
      let data2 = {};
      const filterDataPointFunction = this._getFilterDataPointFunction();
      let lastLevel = {};
      sounding.sounding.getLevels().reverse().forEach((pres) => {
        const levelData = sounding.sounding.getData(pres);
        this._dataGroupIds.forEach((dataGroupId) => {
          if (!(dataGroupId in data2))
            data2[dataGroupId] = [];
          const level = {
            levelData,
            x: void 0,
            y: void 0
          };
          const { x: x5, y: y5 } = this._getCoordinatesByLevelData(
            dataGroupId,
            sounding,
            level.levelData,
            this
          );
          level.x = x5;
          level.y = y5;
          if (x5 === void 0 || y5 === void 0 || filterDataPointFunction !== void 0 && filterDataPointFunction(level, { ...lastLevel }))
            return;
          lastLevel = level;
          data2[dataGroupId].push(level);
        });
      });
      Object.keys(data2).forEach((dataGroupId) => {
        if (data2[dataGroupId].length > 0)
          this._insertDataGroupInto(
            soundingGroup,
            dataGroupId,
            sounding,
            data2[dataGroupId],
            this
          );
      });
      this.trigger("postinsert:sounding", { sounding, node: group });
      if (this._getSoundingVisibility(sounding))
        this._hoverLabelsGroup.clear();
    }
    /**
     * @private
     */
    _getFilterDataPointFunction() {
      return this._filterDataPoint === void 0 ? makeFilterDataPointFunction(this._minDataPointsDistance) : this._filterDataPoint;
    }
    /**
     * Initialize hover labels options.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~hoverLabelsOptions}
     *   options - Hover labels options.
     */
    _initHoverLabels({
      visible: visible2 = true,
      type = "mousemove",
      maxDistance = void 0,
      insertLabelsFunc = void 0,
      getLevelData = () => {
      },
      getHoverSounding = (soundings) => soundings.shift()
    }) {
      this._getHoverSounding = getHoverSounding;
      if (!visible2 || insertLabelsFunc === void 0)
        return;
      this.on("change:extent", () => this._hoverLabelsGroup.clear());
      this.on(type, (e) => {
        const hoverLabelsSounding = this.hoverLabelsSounding;
        if (hoverLabelsSounding === void 0)
          return;
        insertLabelsFunc(
          hoverLabelsSounding,
          getLevelData({ hoverLabelsSounding, e, maxDistance }),
          this._hoverLabelsGroup
        );
      });
    }
  };
  var PlotDataArea_default = PlotDataArea;
  function makeFilterDataPointFunction(minDataPointsDistance) {
    if (minDataPointsDistance === 0)
      return void 0;
    return ({ x: x5, y: y5 }, lastPoint) => {
      if (lastPoint.x === void 0 || lastPoint.y === void 0) {
        lastPoint.x = x5;
        lastPoint.y = y5;
        return false;
      }
      const distance = Math.sqrt(Math.pow(x5 - lastPoint.x, 2) + Math.pow(y5 - lastPoint.y, 2));
      const result = distance < minDataPointsDistance;
      if (!result) {
        lastPoint.x = x5;
        lastPoint.y = y5;
      }
      return result;
    };
  }

  // node_modules/meteojs/thermodynamicDiagram/PlotAltitudeDataArea.js
  var PlotAltitudeDataArea = class extends PlotDataArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
     *   options - Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = 0,
      y: y5 = 0,
      width: width4 = 100,
      height: height4 = 100,
      style = {},
      visible: visible2 = true,
      events = {},
      hoverLabels = {},
      getSoundingVisibility = (sounding) => sounding.visible,
      dataGroupIds = void 0,
      getCoordinatesByLevelData = void 0,
      insertDataGroupInto = void 0,
      filterDataPoint = void 0,
      minDataPointsDistance = 0
    } = {}) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        hoverLabels,
        getSoundingVisibility,
        dataGroupIds,
        getCoordinatesByLevelData,
        insertDataGroupInto,
        filterDataPoint,
        minDataPointsDistance
      });
      this._isHoverLabelsRemote;
    }
    /**
     * Extend an event with pressure.
     * 
     * @override
     */
    getExtendedEvent(e, p) {
      e = super.getExtendedEvent(e, p);
      e.diagramPres = void 0;
      if (this.coordinateSystem !== void 0)
        e.diagramPres = this.coordinateSystem.getPByXY(
          0,
          this.coordinateSystem.height - e.elementY
        );
      return e;
    }
    /**
     * Show also hover labels when mouse isn't over the area.
     * 
     * @type boolean
     * @readonly
     */
    get isHoverLabelsRemote() {
      return this._isHoverLabelsRemote;
    }
    /**
     * Initialize hover labels options.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
     *   options - Hover labels options.
     * @override
     */
    _initHoverLabels({
      visible: visible2 = true,
      type = "mousemove",
      maxDistance = void 0,
      remote = true,
      insertLabelsFunc = void 0,
      getLevelData = ({ hoverLabelsSounding, e }) => {
        if (!e.diagramPres)
          return {};
        const sounding = hoverLabelsSounding.sounding;
        return sounding.getData(sounding.getNearestLevel(e.diagramPres));
      },
      getHoverSounding = void 0
    }) {
      this._isHoverLabelsRemote = remote;
      super._initHoverLabels({
        visible: visible2,
        type,
        maxDistance,
        insertLabelsFunc,
        getLevelData,
        getHoverSounding
      });
    }
  };
  var PlotAltitudeDataArea_default = PlotAltitudeDataArea;

  // node_modules/meteojs/thermodynamicDiagram/TDDiagram.js
  var TDDiagram = class extends PlotAltitudeDataArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions} [options]
     *   Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = 0,
      y: y5 = 0,
      width: width4 = 100,
      height: height4 = 100,
      style = {},
      visible: visible2 = true,
      events = {},
      dataGroupIds = ["temp", "dewp", "wetbulb"],
      getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
        if (levelData.pres === void 0)
          return {};
        let value = void 0;
        switch (dataGroupId) {
          case "temp":
            value = levelData.tmpk;
            break;
          case "dewp":
            value = levelData.dwpk;
            break;
          case "wetbulb":
            value = wetbulbTempByTempAndDewpointAndPres(
              levelData.tmpk,
              levelData.dwpk,
              levelData.pres
            );
            break;
        }
        if (value === void 0)
          return {};
        return {
          x: plotArea.coordinateSystem.getXByPT(levelData.pres, value),
          y: plotArea.coordinateSystem.height - plotArea.coordinateSystem.getYByPT(levelData.pres, value),
          value: Math.round(tempKelvinToCelsius(value) * 10) / 10,
          unit: "\u2103"
        };
      },
      insertDataGroupInto = (svgNode2, dataGroupId, sounding, data2) => {
        if (dataGroupId in sounding.options.diagram && !sounding.options.diagram[dataGroupId].visible)
          return;
        const options = dataGroupId in sounding.options.diagram ? sounding.options.diagram[dataGroupId].style : {};
        svgNode2.group().polyline(data2.map((level) => [level.x, level.y])).fill("none").stroke(options);
      },
      filterDataPoint = void 0,
      minDataPointsDistance = 0,
      isobars = {},
      isotherms = {},
      dryadiabats = {},
      pseudoadiabats = {},
      mixingratio = {},
      hoverLabels = {},
      parcels = {}
    } = {}) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        hoverLabels,
        getSoundingVisibility: (sounding) => sounding.visible && sounding.options.diagram.visible,
        dataGroupIds,
        getCoordinatesByLevelData,
        insertDataGroupInto,
        filterDataPoint,
        minDataPointsDistance
      });
      this.options = {
        isobars: getNormalizedDiagramLineOptions(isobars),
        isotherms: getNormalizedDiagramLineOptions(isotherms, {
          highlightedLines: [tempCelsiusToKelvin(0)]
        }),
        dryadiabats: getNormalizedDiagramLineOptions(dryadiabats),
        pseudoadiabats: getNormalizedDiagramLineOptions(pseudoadiabats, {
          style: {
            color: "rgb(102, 51, 0)",
            dasharray: 6
          }
        }),
        mixingratio: getNormalizedDiagramLineOptions(mixingratio, {
          minPressure: 500,
          style: {
            color: "rgb(102, 51, 0)",
            dasharray: 2
          }
        })
      };
      this.svgGroups = {
        border: this._svgNodeBackground.group(),
        isobars: this._svgNodeBackground.group(),
        isotherms: this._svgNodeBackground.group(),
        dryadiabats: this._svgNodeBackground.group(),
        mixingratio: this._svgNodeBackground.group(),
        pseudoadiabats: this._svgNodeBackground.group()
      };
      this._parcelsOptions = parcels;
      if (!("visible" in this._parcelsOptions))
        this._parcelsOptions.visible = true;
      this._parcels = /* @__PURE__ */ new Map();
      this.on("add:sounding", (sounding) => {
        const soundingParcelsItems = {
          parcelsGroup: void 0,
          parcelsGroups: /* @__PURE__ */ new Map(),
          addItemListenerKey: void 0,
          removeItemListenerKey: void 0,
          changeVisibleListeners: [],
          changeOptionsListeners: []
        };
        const onAddParcel = (diagramParcel) => {
          soundingParcelsItems.changeVisibleListeners.push({
            diagramParcel,
            listenerKey: diagramParcel.on("change:visible", () => {
              if (!soundingParcelsItems.parcelsGroups.has(diagramParcel))
                return;
              const group = soundingParcelsItems.parcelsGroups.get(diagramParcel);
              diagramParcel.visible ? group.show() : group.hide();
            })
          });
          soundingParcelsItems.changeOptionsListeners.push({
            diagramParcel,
            listenerKey: diagramParcel.on("change:options", () => {
              const soundingParcelsItems2 = this._parcels.get(sounding);
              if (soundingParcelsItems2 !== void 0) {
                const group = soundingParcelsItems2.parcelsGroups.get(diagramParcel);
                if (group !== void 0) {
                  soundingParcelsItems2.parcelsGroups.delete(diagramParcel);
                  group.remove();
                }
              }
              this.drawParcel(sounding, diagramParcel);
            })
          });
        };
        soundingParcelsItems.addItemListenerKey = sounding.diagramParcelCollection.on("add:item", (diagramParcel) => {
          onAddParcel(diagramParcel);
          this.drawParcel(sounding, diagramParcel);
        });
        soundingParcelsItems.removeItemListenerKey = sounding.diagramParcelCollection.on("remove:item", (diagramParcel) => {
          const group = soundingParcelsItems.parcelsGroups.get(diagramParcel);
          if (group !== void 0) {
            soundingParcelsItems.parcelsGroups.delete(diagramParcel);
            group.remove();
          }
        });
        for (let diagramParcel of sounding.diagramParcelCollection)
          onAddParcel(diagramParcel);
        this._parcels.set(sounding, soundingParcelsItems);
      });
      this.on("remove:sounding", (sounding) => {
        if (this._parcels.has(sounding)) {
          const soundingParcelsItems = this._parcels.get(sounding);
          sounding.diagramParcelCollection.un("add:item", soundingParcelsItems.addItemListenerKey);
          sounding.diagramParcelCollection.un("remove:item", soundingParcelsItems.removeItemListenerKey);
          soundingParcelsItems.changeVisibleListeners.forEach((listenerObj) => listenerObj.diagramParcel.un("change:visible", listenerObj.listenerKey));
          soundingParcelsItems.changeOptionsListeners.forEach((listenerObj) => listenerObj.diagramParcel.un("change:options", listenerObj.listenerKey));
        }
        this._parcels.delete(sounding);
      });
      this.init();
    }
    /**
     * Return the visibility of the isobars.
     * @returns {boolean} Visibility of the isobars.
     * @deprecated
     */
    getIsobarsVisible() {
      return this.options.isobars.visible;
    }
    /**
     * Sets the visibility of the isobars.
     * @param {boolean} visible Visibility of the isobars.
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
     * @deprecated
     */
    setIsobarsVisible(visible2) {
      this.options.isobars.visible = visible2 ? true : false;
      this.plotIsobars();
      return this;
    }
    /**
     * Return the visibility of the isotherms.
     * @returns {boolean} Visibility of the isotherms.
     * @deprecated
     */
    getIsothermsVisible() {
      return this.options.isotherms.visible;
    }
    /**
     * Sets the visibility of the isotherms.
     * @param {boolean} visible Visibility of the isotherms.
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
     * @deprecated
     */
    setIsothermsVisible(visible2) {
      this.options.isotherms.visible = visible2 ? true : false;
      this.plotIsotherms();
      return this;
    }
    /**
     * Return the visibility of the dry adiabats.
     * @returns {boolean} Visibility of the dry adiabats.
     * @deprecated
     */
    getDryadiabatsVisible() {
      return this.options.dryadiabats.visible;
    }
    /**
     * Sets the visibility of the dry adiabats.
     * @param {boolean} visible Visibility of the dry adiabats.
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
     * @deprecated
     */
    setDryadiabatsVisible(visible2) {
      this.options.dryadiabats.visible = visible2 ? true : false;
      this.plotDryadiabats();
      return this;
    }
    /**
     * Return the visibility of the pseudo adiabats.
     * @returns {boolean} Visibility of the pseudo adiabats.
     * @deprecated
     */
    getPseudoadiabatsVisible() {
      return this.options.pseudoadiabats.visible;
    }
    /**
     * Sets the visibility of the pseudo adiabats.
     * @param {boolean} visible Visibility of the pseudo adiabats.
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
     * @deprecated
     */
    setPseudoadiabatsVisible(visible2) {
      this.options.pseudoadiabats.visible = visible2 ? true : false;
      this.plotPseudoadiabats();
      return this;
    }
    /**
     * Return the visibility of the mixing ratio.
     * @returns {boolean} Visibility of the mixing ratio.
     * @deprecated
     */
    getMixingratioVisible() {
      return this.options.mixingratio.visible;
    }
    /**
     * Sets the visibility of the mixing ratio.
     * @param {boolean} visible Visibility of the mixing ratio.
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
     * @deprecated
     */
    setMixingratioVisible(visible2) {
      this.options.mixingratio.visible = visible2 ? true : false;
      this.plotMixingratio();
      return this;
    }
    /**
     * Draw the sounding into the SVG group.
     * 
     * @override
     */
    drawSounding(sounding, group) {
      super.drawSounding(sounding, group);
      if (this._parcels.has(sounding)) {
        let parcelsObj = this._parcels.get(sounding);
        parcelsObj.parcelsGroup = group.group();
        if (!sounding.options.parcels.visible)
          parcelsObj.parcelsGroup.hide();
        this._parcels.set(sounding, parcelsObj);
      }
      this.drawParcels(sounding);
    }
    /**
     * Draws parcels of a sounding.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   sounding - Sounding.
     */
    drawParcels(sounding) {
      if (!this._parcelsOptions.visible)
        return;
      if (!this._parcels.has(sounding))
        return;
      const soundingParcelsItems = this._parcels.get(sounding);
      soundingParcelsItems.parcelsGroup.clear();
      soundingParcelsItems.parcelsGroups.clear();
      for (let diagramParcel of sounding.diagramParcelCollection)
        this.drawParcel(sounding, diagramParcel);
    }
    /**
     * Draws a parcel.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
     *   diagramSounding - DiagramSounding object, which contains the parcel.
     * @param {module:meteoJS/thermodynamicDiagram/diagramParcel.DiagramParcel}
     *   diagramParcel - Parcel lift to draw.
     * @param {external:SVG} group - SVG group to draw parcel into.
     * @private
     */
    drawParcel(diagramSounding, diagramParcel) {
      const parcel = diagramParcel.parcel;
      if (parcel.pres === void 0 || parcel.tmpc === void 0 || parcel.dwpc === void 0)
        return;
      if (!this._parcels.has(diagramSounding))
        return;
      const soundingParcelsItems = this._parcels.get(diagramSounding);
      const group = soundingParcelsItems.parcelsGroup.group();
      soundingParcelsItems.parcelsGroups.set(diagramParcel, group);
      this._parcels.set(diagramSounding, soundingParcelsItems);
      const pottmpk = potentialTempByTempAndPres(tempCelsiusToKelvin(parcel.tmpc), parcel.pres);
      const hmr = saturationHMRByTempAndPres(tempCelsiusToKelvin(parcel.dwpc), parcel.pres);
      const lclpres = lclByPotentialTempAndHMR(pottmpk, hmr);
      const lcltmpk = lclTemperatureByTempAndDewpoint(
        tempCelsiusToKelvin(parcel.tmpc),
        tempCelsiusToKelvin(parcel.dwpc)
      );
      const lclthetaek = equiPotentialTempByTempAndDewpointAndPres(
        lcltmpk,
        lcltmpk,
        lclpres
      );
      const options = diagramParcel.options;
      if (!options.visible)
        group.hide();
      const tempGroup = group.group();
      if (!options.temp.visible)
        tempGroup.hide();
      let dewpGroup = group.group();
      if (!options.dewp.visible)
        dewpGroup.hide();
      const yInterval = 10;
      const y0 = this.coordinateSystem.getYByPT(parcel.pres, tempCelsiusToKelvin(parcel.tmpc));
      const x0 = this.coordinateSystem.getXByYPotentialTemperature(y0, pottmpk);
      const y1 = this.coordinateSystem.getYByPPotentialTemperatur(lclpres, pottmpk);
      const x1 = this.coordinateSystem.getXByYPotentialTemperature(y1, pottmpk);
      let tempPolyline = [[x0, y0]];
      if (!this.coordinateSystem.isDryAdiabatStraightLine())
        for (let y5 = y0 + yInterval; y5 < y1; y5 += yInterval) {
          tempPolyline.push([
            this.coordinateSystem.getXByYPotentialTemperature(y5, pottmpk),
            y5
          ]);
        }
      tempPolyline.push([x1, y1]);
      const y22 = this.coordinateSystem.height;
      const x22 = this.coordinateSystem.getXByYEquiPotTemp(y22, lclthetaek);
      for (let y5 = y1 + yInterval; y5 < y22; y5 += yInterval) {
        tempPolyline.push([
          this.coordinateSystem.getXByYEquiPotTemp(y5, lclthetaek),
          y5
        ]);
      }
      tempPolyline.push([x22, y22]);
      tempGroup.polyline(tempPolyline.map((point2) => {
        point2[1] = this.coordinateSystem.height - point2[1];
        return point2;
      })).fill("none").stroke(options.temp.style);
      const x0dwp = this.coordinateSystem.getXByYHMR(y0, hmr);
      const x1dwp = this.coordinateSystem.getXByYHMR(y1, hmr);
      let dewpPolyline = [[x0dwp, y0]];
      for (let y5 = y0 + yInterval; y5 < y1; y5 += yInterval) {
        dewpPolyline.push([
          this.coordinateSystem.getXByYHMR(y5, hmr),
          y5
        ]);
      }
      dewpPolyline.push([x1dwp, y1]);
      dewpGroup.polyline(dewpPolyline.map((point2) => {
        point2[1] = this.coordinateSystem.height - point2[1];
        return point2;
      })).fill("none").stroke(options.dewp.style);
    }
    /**
     * Draw background into SVG group.
     * 
     * @override
     */
    _drawBackground(svgNode) {
      super._drawBackground(svgNode);
      this.svgGroups = {
        border: svgNode.group(),
        isobars: svgNode.group(),
        isotherms: svgNode.group(),
        dryadiabats: svgNode.group(),
        mixingratio: svgNode.group(),
        pseudoadiabats: svgNode.group()
      };
      this.svgGroups.border.clear();
      this.svgGroups.border.rect(this.coordinateSystem.width, this.coordinateSystem.height).attr({ stroke: "black", "stroke-width": 1, "fill-opacity": 0 });
      this.plotIsobars(true);
      this.plotIsotherms(true);
      this.plotDryadiabats(true);
      this.plotPseudoadiabats(true);
      this.plotMixingratio(true);
    }
    /**
     * @private
     */
    plotIsobars(redraw) {
      let min = this.coordinateSystem.getPByXY(0, this.coordinateSystem.height);
      let max = this.coordinateSystem.getPByXY(0, 0);
      let delta = max - min;
      this._plotLines(
        this.svgGroups.isobars,
        this.options.isobars,
        {
          min,
          max,
          interval: delta > 500 ? 100 : delta > 50 ? 10 : 1
        },
        (p) => {
          let y5 = this.coordinateSystem.getYByXP(0, p);
          return [[0, y5], [this.coordinateSystem.width, y5]];
        },
        redraw
      );
    }
    /**
     * @private
     */
    plotIsotherms(redraw) {
      let min = tempKelvinToCelsius(
        this.coordinateSystem.getTByXY(0, this.coordinateSystem.height)
      );
      let max = tempKelvinToCelsius(
        this.coordinateSystem.getTByXY(this.coordinateSystem.width, 0)
      );
      let delta = max - min;
      this._plotLines(
        this.svgGroups.isotherms,
        this.options.isotherms,
        {
          min,
          max,
          interval: delta > 50 ? 10 : 5
        },
        (T) => {
          T = tempCelsiusToKelvin(T);
          let result = [[void 0, void 0], [void 0, void 0]];
          if (this.coordinateSystem.isIsothermsVertical()) {
            result[0][1] = 0;
            result[1][1] = this.coordinateSystem.height;
            result[0][0] = result[1][0] = this.coordinateSystem.getXByYT(result[0][1], T);
          } else {
            result[0][1] = 0;
            result[0][0] = this.coordinateSystem.getXByYT(result[0][1], T);
            if (result[0][0] < 0)
              result[0][1] = this.coordinateSystem.getYByXT(result[0][0] = 0, T);
            result[1][0] = this.coordinateSystem.width;
            result[1][1] = this.coordinateSystem.getYByXT(result[1][0], T);
            if (result[1][1] === void 0) {
              result[1][0] = result[0][0];
              result[1][1] = this.coordinateSystem.height;
            } else if (result[1][1] > this.coordinateSystem.height) {
              result[1][1] = this.coordinateSystem.height;
              result[1][0] = this.coordinateSystem.getXByYT(result[1][1], T);
            }
          }
          return result;
        },
        redraw
      );
    }
    /**
     * @private
     */
    plotDryadiabats(redraw) {
      this._plotLines(
        this.svgGroups.dryadiabats,
        this.options.dryadiabats,
        {
          min: tempKelvinToCelsius(
            potentialTempByTempAndPres(
              this.coordinateSystem.getTByXY(0, 0),
              this.coordinateSystem.getPByXY(0, 0)
            )
          ),
          max: tempKelvinToCelsius(
            potentialTempByTempAndPres(
              this.coordinateSystem.getTByXY(this.coordinateSystem.width, this.coordinateSystem.height),
              this.coordinateSystem.getPByXY(this.coordinateSystem.width, this.coordinateSystem.height)
            )
          ),
          interval: 10
        },
        (T) => {
          let TKelvin = tempCelsiusToKelvin(T);
          let y0 = 0;
          let x0 = this.coordinateSystem.getXByYPotentialTemperature(y0, TKelvin);
          if (x0 === void 0 || x0 > this.coordinateSystem.width) {
            x0 = this.coordinateSystem.width;
            y0 = this.coordinateSystem.getYByXPotentialTemperature(x0, TKelvin);
          }
          let x1 = 0;
          let y1 = this.coordinateSystem.getYByXPotentialTemperature(x1, TKelvin);
          if (y1 === void 0 || y1 > this.coordinateSystem.height) {
            y1 = this.coordinateSystem.height;
            x1 = this.coordinateSystem.getXByYPotentialTemperature(y1, TKelvin);
          }
          if (x0 === void 0 || y0 === void 0 || x1 === void 0 || y1 === void 0)
            return void 0;
          if (this.coordinateSystem.isDryAdiabatStraightLine()) {
            return [[x0, y0], [x1, y1]];
          } else {
            let points = [[x0, y0]];
            let yInterval = 10;
            for (let y5 = y0 + yInterval; y5 < y1; y5 += yInterval) {
              points.push([
                this.coordinateSystem.getXByYPotentialTemperature(y5, TKelvin),
                y5
              ]);
            }
            points.push([x1, y1]);
            return points;
          }
        },
        redraw
      );
    }
    /**
     * @private
     */
    plotPseudoadiabats(redraw) {
      this._plotLines(
        this.svgGroups.pseudoadiabats,
        this.options.pseudoadiabats,
        {
          lines: [-18, -5, 10, 30, 60, 110, 180]
        },
        (thetae) => {
          let thetaeKelvin = tempCelsiusToKelvin(thetae);
          const y0 = Math.max(
            0,
            this.options.pseudoadiabats.maxPressure === void 0 ? 0 : this.coordinateSystem.getYByPEquiPotTemp(
              this.options.pseudoadiabats.maxPressure,
              thetaeKelvin
            )
          );
          const x0 = this.coordinateSystem.getXByYEquiPotTemp(y0, thetaeKelvin);
          const y1 = Math.min(
            this.coordinateSystem.height,
            this.options.pseudoadiabats.minPressure === void 0 ? this.coordinateSystem.height : this.coordinateSystem.getYByPEquiPotTemp(
              this.options.pseudoadiabats.minPressure,
              thetaeKelvin
            )
          );
          const x1 = this.coordinateSystem.getXByYEquiPotTemp(y1, thetaeKelvin);
          let points = [[x0, y0]];
          let yInterval = 10;
          for (let y5 = y0 + yInterval; y5 < y1; y5 += yInterval) {
            points.push([
              this.coordinateSystem.getXByYEquiPotTemp(y5, thetaeKelvin),
              y5
            ]);
          }
          points.push([x1, y1]);
          return points;
        },
        redraw
      );
    }
    /**
     * @private
     */
    plotMixingratio(redraw) {
      this._plotLines(
        this.svgGroups.mixingratio,
        this.options.mixingratio,
        {
          lines: [0.01, 0.1, 1, 2, 4, 7, 10, 16, 21, 32, 40]
        },
        (hmr) => {
          const y0 = Math.max(
            0,
            this.options.mixingratio.maxPressure === void 0 ? 0 : this.coordinateSystem.getYByPHMR(
              this.options.mixingratio.maxPressure,
              hmr
            )
          );
          const x0 = this.coordinateSystem.getXByYHMR(y0, hmr);
          const y1 = Math.min(
            this.coordinateSystem.height,
            this.options.mixingratio.minPressure === void 0 ? this.coordinateSystem.height : this.coordinateSystem.getYByPHMR(
              this.options.mixingratio.minPressure,
              hmr
            )
          );
          const x1 = this.coordinateSystem.getXByYHMR(y1, hmr);
          let points = [[x0, y0]];
          const yInterval = 10;
          for (let y5 = y0 + yInterval; y5 < y1; y5 += yInterval) {
            points.push([
              this.coordinateSystem.getXByYHMR(y5, hmr),
              y5
            ]);
          }
          points.push([x1, y1]);
          return points;
        },
        redraw
      );
    }
    /**
     * @private
     */
    _plotLines(node, options, valuesOptions, pointsFunc, redraw) {
      options.visible ? node.show() : node.hide();
      if (!redraw)
        return;
      node.clear();
      let lines = [];
      if (options.lines !== void 0)
        lines = options.lines;
      else if (options.min === void 0 && options.max === void 0 && options.interval === void 0 && valuesOptions.lines !== void 0)
        lines = valuesOptions.lines;
      else {
        if (options.min !== void 0)
          valuesOptions.min = options.min;
        if (options.max !== void 0)
          valuesOptions.max = options.max;
        let interval = options.interval;
        if (interval === void 0)
          interval = valuesOptions.interval;
        let start = Math.ceil(valuesOptions.min / interval) * interval;
        let end = Math.floor(valuesOptions.max / interval) * interval;
        for (let v = start; v <= end; v += interval) {
          lines.push(v);
        }
      }
      let highlightLineWidth = 3;
      if (options.style.width !== void 0)
        highlightLineWidth = options.style.width + 2;
      lines.forEach(function(v) {
        let points = pointsFunc.call(this, v);
        let line = points.length == 2 ? node.line(
          points[0][0],
          this.coordinateSystem.height - points[0][1],
          points[1][0],
          this.coordinateSystem.height - points[1][1]
        ).stroke(options.style) : node.polyline(points.map(function(point2) {
          point2[1] = this.coordinateSystem.height - point2[1];
          return point2;
        }, this)).fill("none").stroke(options.style);
        if (options.highlightedLines !== void 0) {
          options.highlightedLines.forEach((vHighlight) => {
            if (v == tempKelvinToCelsius(vHighlight))
              line.stroke({ width: highlightLineWidth });
          });
        }
      }, this);
    }
    /**
     * Extend an event with temperature and pressure.
     * 
     * @override
     */
    getExtendedEvent(e, p) {
      e = super.getExtendedEvent(e, p);
      e.diagramTmpk = this.coordinateSystem.getTByXY(
        e.elementX,
        this.coordinateSystem.height - e.elementY
      );
      return e;
    }
    /**
     * Initialize hover labels options.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~hoverLabelsOptions}
     *   options - Hover labels options.
     * @override
     */
    _initHoverLabels({
      visible: visible2 = true,
      type = "mousemove",
      maxDistance = void 0,
      remote = true,
      insertLabelsFunc = void 0,
      getHoverSounding = void 0,
      pres = {},
      temp = {},
      dewp = {},
      wetbulb = {}
    }) {
      pres.length = "length" in pres ? pres.length : 60;
      pres.align = "align" in pres ? pres.align : "left";
      if (!("visible" in pres))
        pres.visible = true;
      if (!("style" in pres))
        pres.style = {};
      pres.font = getNormalizedFontOptions(pres.font, {
        anchor: pres.align == "right" ? "end" : "start"
      });
      if (!("fill" in pres))
        pres.fill = {};
      if (pres.fill.opacity === void 0)
        pres.fill.opacity = 0.7;
      if (pres.horizontalMargin === void 0)
        pres.horizontalMargin = 5;
      if (!("visible" in temp))
        temp.visible = true;
      if (!("style" in temp))
        temp.style = {};
      temp.font = getNormalizedFontOptions(temp.font, {
        anchor: "start",
        "alignment-baseline": "bottom"
      });
      if (!("fill" in temp))
        temp.fill = {};
      if (temp.fill.opacity === void 0)
        temp.fill.opacity = 0.7;
      temp.radius = "radius" in temp ? temp.radius : void 0;
      temp.radiusPlus = "radiusPlus" in temp ? temp.radiusPlus : 2;
      if (temp.horizontalMargin === void 0)
        temp.horizontalMargin = 10;
      if (!("visible" in dewp))
        dewp.visible = true;
      if (!("style" in dewp))
        dewp.style = {};
      dewp.font = getNormalizedFontOptions(dewp.font, {
        anchor: "end",
        "alignment-baseline": "bottom"
      });
      if (!("fill" in dewp))
        dewp.fill = {};
      if (dewp.fill.opacity === void 0)
        dewp.fill.opacity = 0.7;
      dewp.radius = "radius" in dewp ? dewp.radius : void 0;
      dewp.radiusPlus = "radiusPlus" in dewp ? dewp.radiusPlus : 2;
      if (dewp.horizontalMargin === void 0)
        dewp.horizontalMargin = 10;
      if (!("visible" in wetbulb))
        wetbulb.visible = true;
      if (!("style" in wetbulb))
        wetbulb.style = {};
      wetbulb.font = getNormalizedFontOptions(wetbulb.font, {
        anchor: "middle"
      });
      if (!("fill" in wetbulb))
        wetbulb.fill = {};
      if (wetbulb.fill.opacity === void 0)
        wetbulb.fill.opacity = 0.7;
      wetbulb.radius = "radius" in wetbulb ? wetbulb.radius : void 0;
      wetbulb.radiusPlus = "radiusPlus" in wetbulb ? wetbulb.radiusPlus : 2;
      if (wetbulb.verticalMargin === void 0)
        wetbulb.verticalMargin = 10;
      if (insertLabelsFunc === void 0)
        insertLabelsFunc = this._makeInsertLabelsFunc(pres, temp, dewp, wetbulb);
      super._initHoverLabels({
        visible: visible2,
        type,
        maxDistance,
        remote,
        insertLabelsFunc,
        getHoverSounding
      });
    }
    /**
     * Makes a default insertLabelsFunc.
     * 
     * @param {Object} pres
     * @param {Object} temp
     * @param {Object} dewp
     * @param {Object} wetbulb
     * @private
     */
    _makeInsertLabelsFunc(pres, temp, dewp, wetbulb) {
      return (sounding, levelData, group) => {
        group.clear();
        if (levelData.pres === void 0)
          return;
        if (pres.visible)
          drawPressureHoverLabelInto(group, levelData, this.coordinateSystem, pres);
        this.dataGroupIds.reverse().forEach((dataGroupId) => {
          let labelOptions = {
            visible: false
          };
          switch (dataGroupId) {
            case "temp":
              labelOptions = temp;
              break;
            case "dewp":
              labelOptions = dewp;
              break;
            case "wetbulb":
              labelOptions = wetbulb;
              break;
          }
          if (!labelOptions.visible)
            return;
          const { x: x5, y: y5, value, unit } = this._getCoordinatesByLevelData(
            dataGroupId,
            sounding,
            levelData,
            this
          );
          if (x5 === void 0 || y5 === void 0)
            return;
          const lineWidth = dataGroupId in this.hoverLabelsSounding.options.diagram ? this.hoverLabelsSounding.options.diagram[dataGroupId].style.width : 3;
          const radius = labelOptions.radius === void 0 ? lineWidth + labelOptions.radiusPlus : labelOptions.radius;
          const fillOptions = labelOptions.style;
          if (!("color" in fillOptions) && dataGroupId in this.hoverLabelsSounding.options.diagram)
            fillOptions.color = sounding.options.diagram[dataGroupId].style.color;
          group.circle(2 * radius).attr({ cx: x5, cy: y5 }).fill(fillOptions);
          drawTextInto({
            node: group,
            text: `${value} ${unit}`,
            x: x5,
            y: y5,
            horizontalMargin: labelOptions.horizontalMargin,
            verticalMargin: labelOptions.verticalMargin,
            font: labelOptions.font,
            fill: labelOptions.fill
          });
        });
      };
    }
  };
  var TDDiagram_default = TDDiagram;
  function drawPressureHoverLabelInto(svgNode, levelData, coordinateSystem, {
    length: length2 = 60,
    align = "left",
    horizontalMargin = void 0,
    verticalMargin = void 0,
    style = {},
    font = {},
    fill = {}
  } = {}) {
    let x0 = 0;
    let x1 = length2;
    const match = /^([0-9]+)%$/.exec(x1);
    if (match)
      x1 = match[1] / 100 * coordinateSystem.width;
    if (align == "right") {
      x0 = coordinateSystem.width;
      x1 = coordinateSystem.width - x1;
    }
    const y5 = coordinateSystem.height - coordinateSystem.getYByXP(0, levelData.pres);
    style = getNormalizedLineStyleOptions(style);
    svgNode.line([
      [Math.min(x0, x1), y5],
      [Math.max(x0, x1), y5]
    ]).stroke(style);
    font = getNormalizedFontOptions(font);
    font["alignment-baseline"] = "bottom";
    drawTextInto({
      node: svgNode,
      text: `${Math.round(levelData.pres)} hPa`,
      x: x0,
      y: y5,
      horizontalMargin,
      verticalMargin,
      font,
      fill
    });
    font["alignment-baseline"] = "top";
    let hghtStr = levelData.hght === void 0 ? `~${Math.round(altitudeISAByPres(levelData.pres))} m` : `${Math.round(levelData.hght)} m`;
    drawTextInto({
      node: svgNode,
      text: hghtStr,
      x: x0,
      y: y5,
      horizontalMargin,
      verticalMargin,
      font,
      fill
    });
  }
  function getNormalizedDiagramLineOptions({
    highlightedLines = void 0,
    interval = void 0,
    lines = void 0,
    max = void 0,
    min = void 0,
    maxPressure = void 0,
    minPressure = void 0,
    style = void 0,
    visible: visible2 = void 0
  }, defaults = {}) {
    return {
      highlightedLines: getFirstDefinedValue(highlightedLines, defaults.highlightedLines),
      interval: getFirstDefinedValue(interval, defaults.interval),
      lines: getFirstDefinedValue(lines, defaults.lines),
      max: getFirstDefinedValue(max, defaults.max),
      min: getFirstDefinedValue(min, defaults.min),
      maxPressure: getFirstDefinedValue(maxPressure, defaults.maxPressure),
      minPressure: getFirstDefinedValue(minPressure, defaults.minPressure),
      style: getNormalizedLineStyleOptions(style, defaults.style),
      visible: getFirstDefinedValue(visible2, defaults.visible, true)
    };
  }

  // node_modules/meteojs/thermodynamicDiagram/WindbarbsProfile.js
  var WindbarbsProfile = class extends PlotAltitudeDataArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/windbarbsProfile~options}
     *   options - Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = void 0,
      y: y5 = void 0,
      width: width4 = void 0,
      height: height4 = void 0,
      style = {},
      visible: visible2 = true,
      events = {},
      hoverLabels = {},
      windbarbLength = void 0,
      dataGroupIds = ["windbarbs"],
      getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
        if (levelData.pres === void 0 || levelData.wspd === void 0 || levelData.wdir === void 0)
          return {};
        return {
          x: plotArea.width / 2,
          y: plotArea.coordinateSystem.height - plotArea.coordinateSystem.getYByXP(0, levelData.pres)
        };
      },
      insertDataGroupInto = (svgNode2, dataGroupId, sounding, data2, plotArea) => {
        data2.forEach((windbarbData) => {
          drawWindbarbInto({
            node: svgNode2,
            x: plotArea.width / 2,
            y: windbarbData.y,
            wspd: windbarbData.levelData.wspd,
            wdir: windbarbData.levelData.wdir,
            length: plotArea._windbarbLength,
            strokeStyle: sounding.options.windprofile.windbarbs.style
          });
        });
      },
      filterDataPoint = void 0,
      minDataPointsDistance = void 0
    }) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        hoverLabels,
        getSoundingVisibility: (sounding) => sounding.visible && sounding.options.windprofile.windbarbs.visible,
        dataGroupIds,
        getCoordinatesByLevelData,
        insertDataGroupInto,
        filterDataPoint,
        minDataPointsDistance: minDataPointsDistance === void 0 ? 0 : minDataPointsDistance
      });
      this._windbarbLength = windbarbLength;
      if (this._windbarbLength === void 0)
        this._windbarbLength = this.width * 2 / 5;
      if (minDataPointsDistance === void 0)
        this.minDataPointsDistance = this._windbarbLength / 2;
      this.init();
    }
  };
  var WindbarbsProfile_default = WindbarbsProfile;

  // node_modules/meteojs/thermodynamicDiagram/WindspeedProfile.js
  var WindspeedProfile = class extends PlotAltitudeDataArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~options} options
     *   Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = void 0,
      x: x5 = void 0,
      y: y5 = void 0,
      width: width4 = void 0,
      height: height4 = void 0,
      style = {},
      visible: visible2 = true,
      events = {},
      hoverLabels = {},
      dataGroupIds = ["windspeed"],
      getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
        if (levelData.pres === void 0 || levelData.wspd === void 0)
          return {};
        return {
          x: plotArea.width * levelData.wspd / plotArea.windspeedMax,
          y: plotArea.coordinateSystem.height - plotArea.coordinateSystem.getYByXP(0, levelData.pres)
        };
      },
      insertDataGroupInto = (svgNode2, dataGroupId, sounding, data2) => {
        svgNode2.polyline(data2.map((level) => [level.x, level.y])).fill("none").stroke(sounding.options.windprofile.windspeed.style);
      },
      windspeedMax = windspeedKNToMS(150),
      grid = {},
      filterDataPoint = void 0,
      minDataPointsDistance = 0
    } = {}) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        hoverLabels,
        getSoundingVisibility: (sounding) => sounding.visible && sounding.options.windprofile.windspeed.visible,
        dataGroupIds,
        getCoordinatesByLevelData,
        insertDataGroupInto,
        filterDataPoint,
        minDataPointsDistance
      });
      this._windspeedMax = windspeedMax;
      this._gridOptions = this.getNormalizedGridOptions(grid);
      this.init();
    }
    /**
     * The maximum visible windspeed. Unit: m/s.
     * 
     * @type number
     */
    get windspeedMax() {
      return this._windspeedMax;
    }
    set windspeedMax(windspeedMax) {
      const oldWindspeedMax = this._windspeedMax;
      this._windspeedMax = windspeedMax;
      if (this._windspeedMax != oldWindspeedMax)
        this.trigger("change:windspeedMax");
    }
    /**
     * Draw background into SVG group.
     * 
     * @override
     */
    _drawBackground(svgNode) {
      super._drawBackground(svgNode);
      if (this._gridOptions.isobars.visible) {
        const isobarsNode = svgNode.group();
        for (let i = this._gridOptions.isobars.min; i <= this._gridOptions.isobars.max; i += this._gridOptions.isobars.interval) {
          const y5 = this.coordinateSystem.height - this.coordinateSystem.getYByXP(0, i);
          isobarsNode.line(0, y5, this.width, y5).stroke(this._gridOptions.isobars.style);
        }
      }
      if (this._gridOptions.isotachs.visible) {
        const isotachsNode = svgNode.group();
        for (let i = this._gridOptions.isotachs.min; i <= this._gridOptions.isotachs.max; i += this._gridOptions.isotachs.interval) {
          const x5 = this.width * i / this.windspeedMax;
          isotachsNode.line(x5, 0, x5, this.height).stroke(this._gridOptions.isotachs.style);
        }
      }
    }
    /**
     * Initialize hover labels options.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~hoverLabelsOptions}
     *   options - Hover labels options.
     * @override
     */
    _initHoverLabels({
      visible: visible2 = true,
      type = "mousemove",
      maxDistance = void 0,
      remote = true,
      insertLabelsFunc = void 0,
      getHoverSounding = void 0,
      windspeed = {}
    }) {
      if (!("visible" in windspeed))
        windspeed.visible = true;
      if (!("style" in windspeed))
        windspeed.style = {};
      windspeed.font = getNormalizedFontOptions(windspeed.font, {
        anchor: "end",
        "alignment-baseline": "bottom"
      });
      if (!("fill" in windspeed))
        windspeed.fill = {};
      if (windspeed.fill.opacity === void 0)
        windspeed.fill.opacity = 0.7;
      windspeed.radius = "radius" in windspeed ? windspeed.radius : void 0;
      windspeed.radiusPlus = "radiusPlus" in windspeed ? windspeed.radiusPlus : 2;
      if (windspeed.horizontalMargin === void 0)
        windspeed.horizontalMargin = 10;
      if (insertLabelsFunc === void 0)
        insertLabelsFunc = this._makeInsertLabelsFunc(windspeed);
      super._initHoverLabels({
        visible: visible2,
        type,
        maxDistance,
        remote,
        insertLabelsFunc,
        getHoverSounding
      });
    }
    /**
     * Makes a default insertLabelsFunc.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~hoverLabelsOptions}
     *   options - Style options for the hover labels.
     * @private
     */
    _makeInsertLabelsFunc({
      visible: visible2 = true,
      style = {},
      font = {},
      fill = {},
      horizontalMargin = 10,
      verticalMargin = 0,
      radius = void 0,
      radiusPlus = 2,
      windspeed = {}
    }) {
      windspeed = (({
        visible: visible3 = true,
        unit = "kn",
        decimalPlaces = 0,
        prefix = " kn"
      }) => {
        return { visible: visible3, unit, decimalPlaces, prefix };
      })(windspeed);
      return (sounding, levelData, group) => {
        group.clear();
        if (levelData === void 0 || levelData.pres === void 0 || !windspeed.visible)
          return;
        if (!visible2 || levelData.wspd === void 0)
          return;
        const { x: x5, y: y5 } = this._getCoordinatesByLevelData(
          "windspeed",
          sounding,
          levelData,
          this
        );
        if (x5 === void 0 || y5 === void 0)
          return;
        const dotRadius = radius === void 0 ? sounding.options.windprofile.windspeed.style.width / 2 + radiusPlus : radius;
        const fillOptions = { ...style };
        if (!("color" in fillOptions))
          fillOptions.color = sounding.options.windprofile.windspeed.style.color;
        group.circle(2 * dotRadius).attr({ cx: x5, cy: y5 }).fill(fillOptions);
        const labelFont = { ...font };
        if (labelFont.anchor == "start" && this.width - x5 < 45)
          labelFont.anchor = "end";
        if (labelFont.anchor == "end" && x5 < 45)
          labelFont.anchor = "start";
        if (labelFont["alignment-baseline"] == "bottom" && y5 < labelFont.size * 5 / 4)
          labelFont["alignment-baseline"] = "top";
        if (labelFont["alignment-baseline"] == "top" && this.height - y5 < labelFont.size * 5 / 4)
          labelFont["alignment-baseline"] = "bottom";
        let text = "";
        switch (windspeed.unit) {
          case "m/s":
            text = Number.parseFloat(levelData.wspd).toFixed(windspeed.decimalPlaces);
            break;
          case "kn":
            text = windspeedMSToKN(levelData.wspd).toFixed(windspeed.decimalPlaces);
            break;
          default:
            text = windspeedMSToKMH(levelData.wspd).toFixed(windspeed.decimalPlaces);
            break;
        }
        text = `${text}${windspeed.prefix}`;
        drawTextInto({
          node: group,
          text,
          x: x5,
          y: y5,
          horizontalMargin,
          verticalMargin,
          font: labelFont,
          fill
        });
      };
    }
    /**
     * Normalizes options for grid.
     * 
     * @private
     */
    getNormalizedGridOptions({
      isotachs = {},
      isobars = {}
    }) {
      isotachs = getNormalizedIsolineOptions(isotachs, {
        min: 0,
        max: this._windspeedMax,
        interval: windspeedKNToMS(50),
        style: {
          color: "grey",
          dasharray: "2 2"
        }
      });
      const isobarsInterval = 100;
      const min = this.coordinateSystem === void 0 ? 100 : Math.ceil(this.coordinateSystem.getPByXY(0, this.height) / isobarsInterval) * isobarsInterval;
      const max = this.coordinateSystem === void 0 ? 1050 : Math.floor(this.coordinateSystem.getPByXY(0, 0) / isobarsInterval) * isobarsInterval;
      isobars = getNormalizedIsolineOptions(isobars, {
        min,
        max,
        interval: isobarsInterval,
        style: {
          color: "grey",
          dasharray: "1 3"
        }
      });
      return {
        isotachs,
        isobars
      };
    }
  };
  var WindspeedProfile_default = WindspeedProfile;
  function getNormalizedIsolineOptions({
    min = void 0,
    max = void 0,
    interval = void 0,
    ...rest
  }, defaults = {}) {
    const options = getNormalizedLineOptions({ ...rest }, defaults);
    options.min = min === void 0 ? defaults.min : min;
    options.max = max === void 0 ? defaults.max : max;
    options.interval = interval === void 0 ? defaults.interval : interval;
    return options;
  }

  // node_modules/meteojs/thermodynamicDiagram/Hodograph.js
  var Hodograph = class extends PlotDataArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/hodograph~options} options
     *   Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem = new CoordinateSystem_default(),
      x: x5,
      y: y5,
      width: width4,
      height: height4,
      style = {},
      visible: visible2 = true,
      events = {},
      hoverLabels = {},
      dataGroupIds = ["windbarbs"],
      getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
        let x6 = void 0;
        let y6 = void 0;
        if (levelData.wspd !== void 0 && levelData.wdir !== void 0) {
          x6 = levelData.wspd * -Math.sin(levelData.wdir / 180 * Math.PI);
          y6 = levelData.wspd * Math.cos(levelData.wdir / 180 * Math.PI);
        } else if (levelData.u !== void 0 && levelData.v !== void 0) {
          x6 = levelData.u;
          y6 = -levelData.v;
        }
        if (x6 === void 0 || y6 === void 0)
          return {};
        return {
          x: plotArea.center[0] + x6 * plotArea.pixelPerSpeed,
          y: plotArea.center[1] + y6 * plotArea.pixelPerSpeed
        };
      },
      insertDataGroupInto = (svgNode2, dataGroupId, sounding, data2) => {
        const basePolylines = [data2.filter((level) => {
          if (sounding.options.hodograph.minPressure !== void 0 && level.levelData.pres !== void 0 && level.levelData.pres < sounding.options.hodograph.minPressure)
            return false;
          if (sounding.options.hodograph.maxPressure !== void 0 && level.levelData.pres !== void 0 && level.levelData.pres > sounding.options.hodograph.maxPressure)
            return false;
          return true;
        })];
        basePolylines[0].sort((a, b) => b.levelData.pres - a.levelData.pres);
        const segmentPolylines = [];
        for (const segment of sounding.options.hodograph.segments) {
          const def = {
            levels: [],
            visible: segment.visible,
            style: segment.style
          };
          basePolylines.map((basePolyline, i) => {
            let lowSplit = void 0;
            let highSplit = void 0;
            basePolyline.map((l) => {
              if (segment.minPressure !== void 0 && segment.minPressure <= l.levelData.pres && segment.maxPressure !== void 0 && segment.maxPressure >= l.levelData.pres || segment.minPressure === void 0 && segment.maxPressure !== void 0 && segment.maxPressure >= l.levelData.pres || segment.minPressure !== void 0 && segment.minPressure <= l.levelData.pres && segment.maxPressure === void 0) {
                def.levels.push(l);
                if (highSplit === void 0)
                  highSplit = l;
                lowSplit = l;
              }
            });
            if (highSplit !== void 0 && lowSplit !== void 0 && highSplit !== lowSplit) {
              const indexLow = basePolyline.findIndex((l) => l.levelData.pres === lowSplit.levelData.pres);
              const indexHigh = basePolyline.findIndex((l) => l.levelData.pres === highSplit.levelData.pres);
              const newBaseLine = basePolyline.slice(indexLow);
              basePolylines[i] = basePolyline.slice(0, indexHigh + 1);
              basePolylines.push(newBaseLine);
            }
          });
          if (def.levels.length > 0)
            segmentPolylines.push(def);
        }
        basePolylines.map((basePolyline) => {
          if (basePolyline.length < 2)
            return;
          svgNode2.polyline(basePolyline.map((level) => [level.x, level.y])).fill("none").stroke(sounding.options.hodograph.style);
        });
        segmentPolylines.map((segmentPolyline) => {
          svgNode2.polyline(segmentPolyline.levels.map((level) => [level.x, level.y])).fill("none").stroke(segmentPolyline.style);
        });
      },
      grid = {},
      windspeedMax = windspeedKNToMS(150),
      origin = void 0,
      filterDataPoint = void 0,
      minDataPointsDistance = 0
    } = {}) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        hoverLabels,
        dataGroupIds,
        getCoordinatesByLevelData,
        insertDataGroupInto,
        getSoundingVisibility: (sounding) => sounding.visible && sounding.options.hodograph.visible,
        filterDataPoint,
        minDataPointsDistance
      });
      this._origin = origin;
      this._windspeedMax = windspeedMax;
      this._gridOptions = this.getNormalizedGridOptions(grid);
      if (this._gridOptions.max === void 0)
        this._gridOptions.max = windspeedMax;
      this.init();
    }
    /**
     * Origin of the hodograph relative to the plot area. If not undefined, it
     * has to be a 2-element array. The first element moves the origin in
     * x direction, the second in y direction. The values are interpreted as
     * relative length (relating to the half width resp. height). Positive values
     * to move in North-East direction. E.g. to move the origin the half way to
     * the upper right corner, use [0.5, 0.5].
     * 
     * @type number[]|undefined
     * @public
     */
    get origin() {
      return this._origin;
    }
    set origin(origin) {
      const oldOrigin = this._origin;
      this._origin = origin;
      this._hoverLabelsGroup.clear();
      if (oldOrigin === void 0 && this._origin !== void 0 || oldOrigin !== void 0 && this._origin === void 0 || oldOrigin !== void 0 && this._origin !== void 0 && (oldOrigin[0] != this._origin[0] || oldOrigin[1] != this._origin[1]))
        this.onCoordinateSystemChange();
    }
    /**
     * The origin of the hodograph in pixel coordinates.
     * 
     * @type number[]
     * @public
     * @readonly
     */
    get center() {
      const center2 = [this.width / 2, this.height / 2];
      if (this._origin !== void 0) {
        center2[0] += this._origin[0] * this.minExtentLength / 2;
        center2[1] -= this._origin[1] * this.minExtentLength / 2;
      }
      return center2;
    }
    /**
     * Returns the pixel per speed unit. Mainly for internal usage.
     * 
     * @type number
     * @public
     * @readonly
     */
    get pixelPerSpeed() {
      const center2 = this.center;
      return Math.min(
        Math.max(this.width - center2[0], center2[0]),
        Math.max(this.height - center2[1], center2[1])
      ) / this._windspeedMax;
    }
    /**
     * Plots hodograph background.
     * 
     * @override
     */
    _drawBackground(svgNode) {
      super._drawBackground(svgNode);
      const center2 = this.center;
      const pixelPerSpeed = this.pixelPerSpeed;
      if (this._gridOptions.axes.visible) {
        svgNode.line(0, center2[1], this.width, center2[1]).stroke(this._gridOptions.axes.style);
        svgNode.line(center2[0], 0, center2[0], this.height).stroke(this._gridOptions.axes.style);
      }
      for (let v = this._gridOptions.circles.interval; v <= this._gridOptions.max; v += this._gridOptions.circles.interval) {
        let radius = v * pixelPerSpeed;
        svgNode.circle(2 * radius).attr({
          cx: center2[0],
          cy: center2[1]
        }).fill("none").stroke(this._gridOptions.circles.style);
        if (this._gridOptions.labels.visible) {
          let xText = radius * Math.cos((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
          let yText = radius * Math.sin((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
          let text = "";
          switch (this._gridOptions.labels.unit) {
            case "m/s":
              text = Number.parseFloat(v).toFixed(this._gridOptions.labels.decimalPlaces);
              break;
            case "kn":
              text = windspeedMSToKN(v).toFixed(this._gridOptions.labels.decimalPlaces);
              break;
            default:
              text = windspeedMSToKMH(v).toFixed(this._gridOptions.labels.decimalPlaces);
              break;
          }
          text += this._gridOptions.labels.prefix;
          let fontColor = void 0;
          const font = { ...this._gridOptions.labels.font };
          if ("color" in font) {
            fontColor = font.color;
            delete font.color;
          }
          const textNode = svgNode.plain(text).font(this._gridOptions.labels.font).center(center2[0] + xText, center2[1] + yText);
          if (fontColor !== void 0)
            textNode.fill(fontColor);
          if (font["text-anchor"] == "end")
            textNode.dx(-textNode.bbox().width / 2 - 3);
          else if (font["text-anchor"] == "start")
            textNode.dx(+textNode.bbox().width / 2 + 3);
          if (this._gridOptions.labels.angle == 90 || this._gridOptions.labels.angle == 270)
            textNode.dy(textNode.bbox().height / 2 + 3);
          if (this._gridOptions.labels.backdrop.visible) {
            const bbox2 = textNode.bbox();
            textNode.before(
              svgNode.rect(bbox2.width, bbox2.height).move(bbox2.x, bbox2.y).fill({ color: this._gridOptions.labels.backdrop.color })
            );
          }
        }
      }
    }
    /**
     * Normalizes options for grid.
     * 
     * @private
     */
    getNormalizedGridOptions({
      axes = {},
      circles = {},
      labels = {},
      max = void 0
    }) {
      axes = getNormalizedLineOptions(axes);
      circles = getNormalizedLineOptions(circles);
      if (!("interval" in circles) || circles.interval === void 0)
        circles.interval = windspeedKMHToMS(50);
      labels = getNormalizedTextOptions(labels);
      if (!("angle" in labels) || labels.angle === void 0)
        labels.angle = 225;
      if (!("unit" in labels) || labels.unit === void 0)
        labels.unit = "km/h";
      if (!("prefix" in labels) || labels.prefix === void 0)
        labels.prefix = "";
      if (!("decimalPlaces" in labels) || labels.decimalPlaces === void 0)
        labels.decimalPlaces = 0;
      if (!("backdrop" in labels) || labels.backdrop === void 0)
        labels.backdrop = {};
      if (!("color" in labels.backdrop))
        labels.backdrop.color = "white";
      if (!("visible" in labels.backdrop))
        labels.backdrop.visible = true;
      if (labels.font.size === void 0)
        labels.font.size = 10;
      return {
        axes,
        circles,
        labels,
        max
      };
    }
    /**
     * Initialize hover labels options.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/hodograph~hoverLabelsOptions}
     *   options - Hover labels options.
     */
    _initHoverLabels({
      visible: visible2 = true,
      type = "mousemove",
      maxDistance = 20,
      insertLabelsFunc = void 0,
      getLevelData = ({ hoverLabelsSounding, e, maxDistance: maxDistance2 }) => {
        const sounding = hoverLabelsSounding.sounding;
        let smallestDistanceSquare = void 0;
        let nearestLevelData = void 0;
        sounding.getLevels().filter((pres) => (hoverLabelsSounding.options.hodograph.minPressure === void 0 || hoverLabelsSounding.options.hodograph.minPressure <= pres) && (hoverLabelsSounding.options.hodograph.maxPressure === void 0 || pres <= hoverLabelsSounding.options.hodograph.maxPressure)).map((pres) => {
          const levelData = sounding.getData(pres);
          if (levelData.wspd === void 0 || levelData.wdir === void 0)
            return;
          const { x: x5, y: y5 } = this._getCoordinatesByLevelData(
            "windbarbs",
            sounding,
            levelData,
            this
          );
          const distanceSquare = Math.pow(e.elementX - x5, 2) + Math.pow(e.elementY - y5, 2);
          if (nearestLevelData === void 0 || distanceSquare < smallestDistanceSquare) {
            smallestDistanceSquare = distanceSquare;
            nearestLevelData = levelData;
          }
        });
        if (maxDistance2 !== void 0 && Math.pow(maxDistance2, 2) < smallestDistanceSquare)
          nearestLevelData = {};
        return nearestLevelData;
      },
      getHoverSounding = void 0,
      hodograph = {}
    }) {
      if (!("visible" in hodograph))
        hodograph.visible = true;
      if (!("style" in hodograph))
        hodograph.style = {};
      hodograph.font = getNormalizedFontOptions(hodograph.font, {
        anchor: "end",
        "alignment-baseline": "bottom"
      });
      if (!("fill" in hodograph))
        hodograph.fill = {};
      if (hodograph.fill.opacity === void 0)
        hodograph.fill.opacity = 0.7;
      if (hodograph.fill.color === void 0)
        hodograph.fill.color = "white";
      if (insertLabelsFunc === void 0)
        insertLabelsFunc = this._makeInsertLabelsFunc(hodograph);
      super._initHoverLabels({
        visible: visible2,
        type,
        maxDistance,
        insertLabelsFunc,
        getLevelData,
        getHoverSounding
      });
    }
    /**
     * Makes a default insertLabelsFunc.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/hodograph~labelsOptions}
     *   options - Style options for the hover labels.
     * @private
     */
    _makeInsertLabelsFunc({
      visible: visible2 = true,
      style = {},
      font = {},
      fill = {},
      horizontalMargin = 10,
      verticalMargin = 0,
      radius = void 0,
      radiusPlus = 2,
      pressure = {},
      windspeed = {},
      winddir = {}
    }) {
      pressure = (({
        visible: visible3 = true,
        decimalPlaces = 0,
        prefix = " hPa"
      }) => {
        return { visible: visible3, decimalPlaces, prefix };
      })(pressure);
      windspeed = (({
        visible: visible3 = true,
        unit = "kn",
        decimalPlaces = 0,
        prefix = " kn"
      }) => {
        return { visible: visible3, unit, decimalPlaces, prefix };
      })(windspeed);
      winddir = (({
        visible: visible3 = true,
        decimalPlaces = 0,
        prefix = "\xB0"
      }) => {
        return { visible: visible3, decimalPlaces, prefix };
      })(winddir);
      return (sounding, levelData, group) => {
        group.clear();
        if (levelData === void 0 || !visible2)
          return;
        const { x: x5, y: y5 } = this._getCoordinatesByLevelData(
          "windbarbs",
          sounding,
          levelData,
          this
        );
        if (x5 === void 0 || y5 === void 0)
          return;
        let defaultStyle = sounding.options.hodograph.style;
        if (levelData.pres !== void 0)
          sounding.options.hodograph.segments.map((segment) => {
            if ((segment.minPressure === void 0 || segment.minPressure <= levelData.pres) && (segment.maxPressure === void 0 || segment.maxPressure >= levelData.pres))
              defaultStyle = segment.style;
          });
        const dotRadius = radius === void 0 ? defaultStyle.width / 2 + radiusPlus : radius;
        const fillOptions = { ...style };
        if (!("color" in fillOptions))
          fillOptions.color = defaultStyle.color;
        group.circle(2 * dotRadius).attr({ cx: x5, cy: y5 }).fill(fillOptions);
        const background = group.rect().fill(fill);
        const labelFont = { ...font };
        labelFont.anchor = "start";
        if (labelFont.anchor == "start" && this.width - x5 < 45)
          labelFont.anchor = "end";
        if (labelFont.anchor == "end" && x5 < 45)
          labelFont.anchor = "start";
        let yDelta = 0;
        let textGroups = [];
        const texts = [];
        if (pressure.visible) {
          const text = Number.parseFloat(levelData.pres).toFixed(pressure.decimalPlaces);
          texts.push(`${text}${pressure.prefix}`);
        }
        if (windspeed.visible) {
          let text = "";
          switch (windspeed.unit) {
            case "m/s":
              text = Number.parseFloat(levelData.wspd).toFixed(windspeed.decimalPlaces);
              break;
            case "kn":
              text = windspeedMSToKN(levelData.wspd).toFixed(windspeed.decimalPlaces);
              break;
            default:
              text = windspeedMSToKMH(levelData.wspd).toFixed(windspeed.decimalPlaces);
              break;
          }
          texts.push(`${text}${windspeed.prefix}`);
        }
        if (winddir.visible) {
          const text = Number.parseFloat(levelData.wdir).toFixed(winddir.decimalPlaces);
          texts.push(`${text}${winddir.prefix}`);
        }
        texts.map((text) => {
          yDelta += labelFont.size * 5 / 4;
          textGroups.push(drawTextInto({
            node: group,
            text,
            x: x5,
            y: y5 + yDelta,
            horizontalMargin,
            verticalMargin,
            font: labelFont
          }));
        });
        if (y5 + yDelta > this.height)
          textGroups.map((g) => g.dy(-yDelta));
        const maxBBox = {
          x: void 0,
          y: void 0,
          x2: void 0,
          y2: void 0
        };
        textGroups.map((g) => {
          g.children().map((el) => {
            if (el.type != "text")
              return;
            const bbox2 = el.bbox();
            if (maxBBox.x === void 0 || bbox2.x < maxBBox.x)
              maxBBox.x = bbox2.x;
            if (maxBBox.y === void 0 || bbox2.y < maxBBox.y)
              maxBBox.y = bbox2.y;
            if (maxBBox.x2 === void 0 || maxBBox.x2 < bbox2.x2)
              maxBBox.x2 = bbox2.x2;
            if (maxBBox.y2 === void 0 || maxBBox.y2 < bbox2.y2)
              maxBBox.y2 = bbox2.y2;
          });
        });
        background.attr({
          x: maxBBox.x,
          y: maxBBox.y,
          width: maxBBox.x2 - maxBBox.x,
          height: maxBBox.y2 - maxBBox.y
        });
      };
    }
  };
  var Hodograph_default = Hodograph;

  // node_modules/meteojs/thermodynamicDiagram/Axis.js
  var Axis = class extends PlotArea_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/axis~options} options
     *   Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem,
      x: x5,
      y: y5,
      width: width4,
      height: height4,
      style = {},
      visible: visible2 = true,
      events = {},
      labels = {},
      title = {},
      isHorizontal = true
    }) {
      if (style.overflow === void 0)
        style.overflow = "visible";
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events
      });
      this._labelsOptions = this.getNormalizedLabelsOptions(labels);
      this._titleOptions = getNormalizedTitleOptions(title);
      this._isHorizontal = isHorizontal;
      this.init();
    }
    /**
     * Normalize the options for the labels.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
     *   options - Options.
     * @returns {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
     *   Normalized options.
     */
    getNormalizedLabelsOptions({
      interval = void 0,
      unit = "",
      prefix = "",
      decimalPlaces = 0,
      ...rest
    }) {
      const options = getNormalizedTextOptions({ ...rest }, {
        font: {
          size: 11,
          anchor: "middle"
        }
      });
      options.interval = interval;
      options.unit = unit;
      options.prefix = prefix;
      options.decimalPlaces = decimalPlaces;
      return options;
    }
    /**
     * Draws the labels of the axis.
     * 
     * @param {external:SVG} svgNode - Node to draw into.
     * @param {number} min - Minimum value for the labels.
     * @param {number} max - Maximum value for the labels.
     * @param {Function} getTextByInterval
     *   Returns the text representation of the label value (its argument).
     * @param {Function} getPositionByInterval
     *   Returns the position in pixels of the label value (its argument).
     * @internal
     */
    drawLabels({
      svgNode,
      min,
      max,
      getTextByInterval = (i) => Number.parseFloat(i).toFixed(this._labelsOptions.decimalPlaces),
      getPositionByInterval
    }) {
      for (let i = min; i <= max; i += this._labelsOptions.interval) {
        let text = getTextByInterval(i);
        text += this._labelsOptions.prefix;
        let fontColor = void 0;
        const font = { ...this._labelsOptions.font };
        if ("color" in font) {
          fontColor = font.color;
          delete font.color;
        }
        if (!this._isHorizontal)
          font["anchor"] = "end";
        const textNode = svgNode.plain(text).font(font);
        if (this._isHorizontal) {
          textNode.center(
            getPositionByInterval(i),
            font.size
          );
          if (font["anchor"] == "end")
            textNode.dx(-textNode.bbox().width / 2);
          else if (font["anchor"] == "start")
            textNode.dx(+textNode.bbox().width / 2);
        } else
          textNode.x(this.width).cy(getPositionByInterval(i)).dx(-textNode.bbox().width);
        if (fontColor !== void 0)
          textNode.fill(fontColor);
      }
    }
    /**
     * Draws a title for the axis.
     * 
     * @param {Object} options - Options.
     * @param {external:SVG} svgNode - Node to insert into.
     * @param {external:SVG} svgLabelsNode - Node of the axis labels.
     * @private
     */
    _drawTitle({
      svgNode,
      svgLabelsNode
    }) {
      let rotation = 0;
      if (!this._isHorizontal)
        rotation = -90;
      let margin = 0;
      if (svgLabelsNode !== void 0)
        margin = rotation == -90 ? svgLabelsNode.bbox().width : svgLabelsNode.bbox().height;
      let fontColor = void 0;
      const font = { ...this._titleOptions.font };
      if ("color" in font) {
        fontColor = font.color;
        delete font.color;
      }
      let cxText = this.width / 2;
      let cyText = font.size + margin;
      if (rotation == -90) {
        cxText = this.width - font.size - margin;
        cyText = this.height / 2;
      }
      const textNode = svgNode.plain(this._titleOptions.text).font(font).center(cxText, cyText).rotate(rotation);
      if (fontColor !== void 0)
        textNode.fill(fontColor);
      if (rotation == -90) {
        if (font["anchor"] == "end")
          textNode.dy(-textNode.bbox().height / 2);
        else if (font["anchor"] == "start")
          textNode.dy(+textNode.bbox().height / 2);
      } else {
        if (font["anchor"] == "end")
          textNode.dx(-textNode.bbox().width / 2);
        else if (font["anchor"] == "start")
          textNode.dx(+textNode.bbox().width / 2);
      }
    }
    /**
     * Draw background into SVG group.
     * 
     * @override
     */
    _drawBackground(svgNode) {
      super._drawBackground(svgNode);
      let svgLabelsGroup = void 0;
      if (this._labelsOptions.visible) {
        svgLabelsGroup = svgNode.group();
        this.drawLabels({
          svgNode: svgLabelsGroup
        });
      }
      if (this._titleOptions.visible)
        this._drawTitle({
          svgNode: svgNode.group(),
          svgLabelsNode: svgLabelsGroup
        });
    }
  };
  var Axis_default = Axis;
  function getNormalizedTitleOptions({
    text = "",
    ...rest
  }) {
    const options = getNormalizedTextOptions({ ...rest }, {
      font: {
        anchor: "middle"
      }
    });
    options.text = text;
    return options;
  }

  // node_modules/meteojs/thermodynamicDiagram/axes/xAxis.js
  var xAxis = class extends Axis_default {
    /**
     * Normalize the options for the labels.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/axes/xAxis~labelOptions}
     *   options - Options.
     * @returns {module:meteoJS/thermodynamicDiagram/axes/xAxis~labelOptions}
     *   Normalized options.
     * @override
     */
    getNormalizedLabelsOptions({
      interval = 10,
      unit = "\xB0C",
      ...rest
    }) {
      return super.getNormalizedLabelsOptions({
        interval,
        unit,
        ...rest
      });
    }
    /**
     * Draws the labels of the axis.
     * 
     * @param {external:SVG} svgNode - Node to draw into.
     * @param {number} [min] - Minimum temperature value to label.
     * @param {number} [max] - Maximum temperature value to label.
     * @param {Function} [getTextByInterval]
     *   Returns the text representation of the label value (its argument).
     * @param {Function} [getPositionByInterval]
     *   Returns the position in pixels of the label value (its argument).
     * @override
     */
    drawLabels({
      svgNode,
      getTextByInterval = (T) => Number.parseFloat(T).toFixed(this._labelsOptions.decimalPlaces),
      getPositionByInterval = (T) => {
        if (this._labelsOptions.unit == "\xB0C")
          T = tempCelsiusToKelvin(T);
        return this.coordinateSystem.getXByYT(0, T);
      }
    }) {
      const min = this._labelsOptions.unit == "\xB0C" ? Math.ceil(tempKelvinToCelsius(this.coordinateSystem.getTByXY(0, 0)) / this._labelsOptions.interval) * this._labelsOptions.interval : Math.ceil(this.coordinateSystem.getTByXY(0, 0) / this._labelsOptions.interval) * this._labelsOptions.interval;
      const max = this._labelsOptions.unit == "\xB0C" ? Math.floor(tempKelvinToCelsius(this.coordinateSystem.getTByXY(this.width, 0)) / this._labelsOptions.interval) * this._labelsOptions.interval : Math.floor(this.coordinateSystem.getTByXY(this.width, 0) / this._labelsOptions.interval) * this._labelsOptions.interval;
      super.drawLabels({
        svgNode,
        min,
        max,
        getTextByInterval,
        getPositionByInterval
      });
    }
  };

  // node_modules/meteojs/thermodynamicDiagram/axes/yAxis.js
  var yAxis = class extends Axis_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~options} options
     *   Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem,
      x: x5,
      y: y5,
      width: width4,
      height: height4,
      style = {},
      visible: visible2 = true,
      events = {},
      labels = {},
      title = {}
    }) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        labels,
        title,
        isHorizontal: false
      });
    }
    /**
     * Normalize the options for the labels.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions}
     *   options - Options.
     * @returns {module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions}
     *   Normalized options.
     * @override
     */
    getNormalizedLabelsOptions({
      interval = 50,
      unit = "hPa",
      ...rest
    }) {
      return super.getNormalizedLabelsOptions({
        interval,
        unit,
        ...rest
      });
    }
    /**
     * Draws the labels of the axis.
     * 
     * @param {external:SVG} svgNode - Node to draw into.
     * @param {number} [min] - Minimum windspeed value to label.
     * @param {number} [max]
     *   Maximum windspeed value to label.
     * @param {Function} [getTextByInterval]
     *   Returns the text representation of the label value (its argument).
     * @param {Function} [getPositionByInterval]
     *   Returns the position in pixels of the label value (its argument).
     * @override
     */
    drawLabels({
      svgNode,
      min = Math.ceil(this.coordinateSystem.getPByXY(0, this.height) / this._labelsOptions.interval) * this._labelsOptions.interval,
      max = Math.floor(this.coordinateSystem.getPByXY(0, 0) / this._labelsOptions.interval) * this._labelsOptions.interval,
      getTextByInterval = (level) => Number.parseFloat(level).toFixed(this._labelsOptions.decimalPlaces),
      getPositionByInterval = (level) => this.height - this.coordinateSystem.getYByXP(0, level)
    }) {
      super.drawLabels({
        svgNode,
        min,
        max,
        getTextByInterval,
        getPositionByInterval
      });
    }
  };

  // node_modules/meteojs/thermodynamicDiagram/axes/WindspeedProfileAxis.js
  var WindspeedProfileAxis = class extends Axis_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~options}
     *   options - Options.
     */
    constructor({
      svgNode = void 0,
      coordinateSystem,
      x: x5,
      y: y5,
      width: width4,
      height: height4,
      style = {},
      visible: visible2 = true,
      events = {},
      labels = {},
      title = {},
      windspeedMax = windspeedKNToMS(150)
    }) {
      super({
        svgNode,
        coordinateSystem,
        x: x5,
        y: y5,
        width: width4,
        height: height4,
        style,
        visible: visible2,
        events,
        labels,
        title
      });
      this._windspeedMax = windspeedMax;
      this.init();
    }
    /**
     * Maximum axis value. Unit: m/s.
     * 
     * @type number
     */
    get windspeedMax() {
      return this._windspeedMax;
    }
    set windspeedMax(windspeedMax) {
      const oldWindspeedMax = this._windspeedMax;
      this._windspeedMax = windspeedMax;
      if (this._windspeedMax != oldWindspeedMax)
        this.onCoordinateSystemChange();
    }
    /**
     * Normalize the options for the labels.
     * 
     * @param {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions}
     *   options - Options.
     * @returns {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions}
     *   Normalized options.
     * @override
     */
    getNormalizedLabelsOptions({
      interval = windspeedKNToMS(50),
      unit = "kn",
      prefix = " kn",
      ...rest
    }) {
      return super.getNormalizedLabelsOptions({
        interval,
        unit,
        prefix,
        ...rest
      });
    }
    /**
     * Draws the labels of the axis.
     * 
     * @param {external:SVG} svgNode - Node to draw into.
     * @param {number} [min=0] - Minimum windspeed value to label.
     * @param {number} [max=this._windspeedMax]
     *   Maximum windspeed value to label.
     * @param {Function} [getTextByInterval]
     *   Returns the text representation of the label value (its argument).
     * @param {Function} [getPositionByInterval]
     *   Returns the position in pixels of the label value (its argument).
     * @override
     */
    drawLabels({
      svgNode,
      min = 0,
      max = this._windspeedMax,
      getTextByInterval = (windspeed) => {
        switch (this._labelsOptions.unit) {
          case "m/s":
            return Number.parseFloat(windspeed).toFixed(this._labelsOptions.decimalPlaces);
          case "kn":
            return windspeedMSToKN(windspeed).toFixed(this._labelsOptions.decimalPlaces);
          default:
            return windspeedMSToKMH(windspeed).toFixed(this._labelsOptions.decimalPlaces);
        }
      },
      getPositionByInterval = (windspeed) => this.width * windspeed / this._windspeedMax
    }) {
      super.drawLabels({
        svgNode,
        min,
        max,
        getTextByInterval,
        getPositionByInterval
      });
    }
  };

  // node_modules/meteojs/ThermodynamicDiagram.js
  var ThermodynamicDiagram = class extends ThermodynamicDiagramPluggable_default {
    /**
     * @param {module:meteoJS/thermodynamicDiagram~options} options - Options.
     */
    constructor({
      renderTo = void 0,
      width: width4 = void 0,
      height: height4 = void 0,
      coordinateSystem = {},
      diagram = {},
      windbarbsProfile = {},
      windspeedProfile = {},
      windspeedProfileAxis = {},
      hodograph = {},
      xAxis: xAxis2 = {},
      yAxis: yAxis2 = {}
    }) {
      super({
        renderTo,
        width: width4,
        height: height4
      });
      diagram = normalizePlotAreaOptions(diagram);
      windbarbsProfile = normalizePlotAreaOptions(windbarbsProfile);
      windspeedProfile = normalizePlotAreaOptions(windspeedProfile);
      windspeedProfileAxis = normalizePlotAreaOptions(windspeedProfileAxis);
      hodograph = normalizePlotAreaOptions(hodograph);
      xAxis2 = normalizePlotAreaOptions(xAxis2);
      yAxis2 = normalizePlotAreaOptions(yAxis2);
      let defaultPadding = this.svgNode.width() * 0.05;
      if (xAxis2.width === void 0 && diagram.width === void 0 && windbarbsProfile.width === void 0 && windspeedProfile.width === void 0) {
        yAxis2.width = (this.svgNode.width() - 2 * defaultPadding) * 0.1;
        diagram.width = (this.svgNode.width() - 2 * defaultPadding) * 0.7;
        windbarbsProfile.width = (this.svgNode.width() - 2 * defaultPadding) * 0.2 * 1 / 3;
        windspeedProfile.width = (this.svgNode.width() - 2 * defaultPadding) * 0.2 * 2 / 3;
      } else if (diagram.width === void 0)
        diagram.width = this.svgNode.width() - 2 * defaultPadding - windbarbsProfile.width - windspeedProfile.width;
      else if (windbarbsProfile.width === void 0 && windspeedProfile.width === void 0) {
        windbarbsProfile.width = (this.svgNode.width() - 2 * defaultPadding - diagram.width) * 1 / 3;
        windspeedProfile.width = (this.svgNode.width() - 2 * defaultPadding - diagram.width) * 2 / 3;
      }
      if (yAxis2.x === void 0 && diagram.x === void 0 && windbarbsProfile.x === void 0 && windspeedProfile.x === void 0) {
        yAxis2.x = defaultPadding;
        diagram.x = yAxis2.x + yAxis2.width;
        windbarbsProfile.x = diagram.x + diagram.width;
        windspeedProfile.x = windbarbsProfile.x + windbarbsProfile.width;
      } else if (diagram.x === void 0)
        diagram.x = windbarbsProfile.x - windbarbsProfile.width;
      else if (windbarbsProfile.x === void 0 && windspeedProfile.x === void 0) {
        windbarbsProfile.x = diagram.x + diagram.width;
        windspeedProfile.x = windbarbsProfile.x + windbarbsProfile.width;
      }
      if (xAxis2.height === void 0)
        xAxis2.height = this.svgNode.height() * 0.06;
      if (diagram.height === void 0)
        diagram.height = this.svgNode.height() - xAxis2.height - 2 * defaultPadding;
      if (yAxis2.height === void 0)
        yAxis2.height = diagram.height;
      if (windbarbsProfile.height === void 0)
        windbarbsProfile.height = diagram.height;
      if (windspeedProfile.height === void 0)
        windspeedProfile.height = diagram.height;
      if (diagram.y === void 0)
        diagram.y = defaultPadding;
      if (yAxis2.y === void 0)
        yAxis2.y = diagram.y;
      if (windbarbsProfile.y === void 0)
        windbarbsProfile.y = diagram.y;
      if (windspeedProfile.y === void 0)
        windspeedProfile.y = diagram.y;
      if (xAxis2.width === void 0)
        xAxis2.width = diagram.width;
      if (xAxis2.x === void 0)
        xAxis2.x = diagram.x;
      if (xAxis2.y === void 0)
        xAxis2.y = diagram.y + diagram.height;
      if (xAxis2.height === void 0)
        xAxis2.height = defaultPadding;
      if (windspeedProfileAxis.width === void 0)
        windspeedProfileAxis.width = windspeedProfile.width;
      if (windspeedProfileAxis.height === void 0)
        windspeedProfileAxis.height = defaultPadding;
      if (windspeedProfileAxis.x === void 0)
        windspeedProfileAxis.x = windspeedProfile.x;
      if (windspeedProfileAxis.y === void 0)
        windspeedProfileAxis.y = windspeedProfile.y + windspeedProfile.height;
      if (hodograph.x === void 0)
        hodograph.x = diagram.x;
      if (hodograph.y === void 0)
        hodograph.y = diagram.y;
      if (hodograph.width === void 0)
        hodograph.width = Math.min(diagram.width, diagram.height) * 0.4;
      if (hodograph.height === void 0)
        hodograph.height = hodograph.width;
      this.diagram = new TDDiagram_default(diagram);
      this.appendPlotArea(this.diagram);
      this.yAxis = new yAxis(yAxis2);
      this.appendPlotArea(this.yAxis);
      this.xAxis = new xAxis(xAxis2);
      this.appendPlotArea(this.xAxis);
      this.windbarbsProfile = new WindbarbsProfile_default(windbarbsProfile);
      this.appendPlotArea(this.windbarbsProfile);
      this.windspeedProfile = new WindspeedProfile_default(windspeedProfile);
      this.windspeedProfile.on("prebuild:background", ({ node }) => {
        node.rect(this.windspeedProfile.width, this.windspeedProfile.height).fill({ color: "white" }).stroke({ color: "black", width: 1 });
      });
      this.appendPlotArea(this.windspeedProfile);
      this.windspeedProfileAxis = new WindspeedProfileAxis(windspeedProfileAxis);
      this.appendPlotArea(this.windspeedProfileAxis);
      this.hodograph = new Hodograph_default(hodograph);
      this.hodograph.on("prebuild:background", ({ node }) => {
        node.rect(this.hodograph.width - 2, this.hodograph.height - 2).move(1, 1).fill({ color: "white" }).stroke({ color: "black", width: 1 });
      });
      this.appendPlotArea(this.hodograph);
      if (coordinateSystem.type === void 0)
        coordinateSystem.type = "skewTlogP";
      coordinateSystem.width = diagram.width;
      coordinateSystem.height = diagram.height;
      this._coordinateSystem;
      this.coordinateSystem = coordinateSystem.type == "stueve" ? new StueveDiagram_default(coordinateSystem) : coordinateSystem.type == "emagram" ? new Emagram_default(coordinateSystem) : new SkewTlogPDiagram_default(coordinateSystem);
    }
    /**
     * Coordinate system for the different plot areas.
     * 
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @public
     */
    get coordinateSystem() {
      return this._coordinateSystem;
    }
    set coordinateSystem(coordinateSystem) {
      this._coordinateSystem = coordinateSystem;
      this.exchangeCoordinateSystem(this._coordinateSystem);
    }
    /**
     * Returns the object of the thermodynamic diagram plot area.
     * 
     * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} Diagram object.
     * @deprecated
     */
    getDiagramPlotArea() {
      return this.diagram;
    }
  };
  var ThermodynamicDiagram_default = ThermodynamicDiagram;
  function normalizePlotAreaOptions({
    svgNode = void 0,
    coordinateSystem = void 0,
    x: x5 = void 0,
    y: y5 = void 0,
    width: width4 = void 0,
    height: height4 = void 0,
    style = {},
    visible: visible2 = true,
    events = {},
    hoverLabels = {},
    ...result
  }) {
    result.svgNode = svgNode;
    result.coordinateSystem = coordinateSystem;
    result.x = x5;
    result.y = y5;
    result.width = width4;
    result.height = height4;
    result.style = style;
    result.visible = visible2;
    result.events = events;
    result.hoverLabels = hoverLabels;
    return result;
  }
  return __toCommonJS(meteojs_entry_exports);
})();
