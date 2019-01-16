/**
 * Created by wangcong on 2018/08/02.
 * js sql语句生成器
 * url:https://github.com/wangcong099878/forests
 */
;var globalDB;
(function (w) {
    var _config = {
        tabname: "demo",
        dbname: "youshang",
    };

    var S = function (config) {
        switch (typeof(config)) {
            case "object":
                this.construct(config);
                break;
            case "string":
                this.construct(config);
                this.tabname = config;
                break;
            default:
                alert("请传入正确的参数");
        }
        return this;
    }
    //构建类属性
    S.prototype.construct = function (config) {
        var config = config ? config : {};
        for (var i in _config) {
            if (config[i]){
              _config[i] = config[i];
            }
        }
        this.config = _config;
        this.tabname = this.config.tabname;
        this.dbname = this.config.dbname;
        this.whereSql = "";
        this.sql = "";
        this.limitSql = "";
        this.orderSql = "";
    }

    S.prototype.order = function(orderSql){
        //order by name desc, id asc;
        if(this.orderSql==""){
            this.orderSql = " ORDER BY " + orderSql;
        }else{
            this.orderSql += " , " + orderSql;
        }
        return this;
    }

    /*条件组装*/
    S.prototype.addWhere = function (sql, isOr) {
        flag = "AND";
        if (typeof(isOr) != 'undefined') {
            flag = "OR";
        }

        if (this.whereSql == "") {
            this.whereSql = " WHERE " + sql;
        } else {
            this.whereSql += " " + flag + " " + sql;
        }
        return this;
    }

    S.prototype.makeWhere = function (field, condition, value, isOr) {
        if (typeof(field) == 'function') {
            this.addWhere(field(), isOr);
            return this;
        }

        field = "`" + field + "`";

        switch (typeof(value)) {
            case "undefined":
                value = condition;
                condition = "=";
                break;
            case "string":
                value = "'" + value + "'";
                break;
            case "number":
                value = value;
                break;
            case "object":
                var k = [];
                var v = [];
                for (var i in value) {
                    k.push("`" + i + "`");
                    var valueItem = value[i];
                    switch (typeof(value[i])) {
                        case "string":
                            v.push("'" + valueItem + "'");
                            break;
                        case "number":
                            v.push(valueItem);
                            break;
                    }
                }
                value = " (" + v.join(',') + ") ";
                break;
        }

        this.addWhere(field + " " + condition + " " + value, isOr);

        return this;
    }

    S.prototype.where = function (field, condition, value) {
        this.makeWhere(field, condition, value);
        return this;
    };

    S.prototype.orWhere = function (field, condition, value) {
        this.makeWhere(field, condition, value, 1);
        return this;
    };

    S.prototype.makeSelect = function (fieldList, type) {
        if (typeof(fieldList) == 'undefined') {
            fieldList = '*';
        }
        if (typeof(fieldList) == 'string') {
            field = fieldList;
        }

        var sql = "";
        switch (type) {
            case "select":
                sql = 'SELECT ' + fieldList + ' FROM ' + this.tabname;
                break;
            case "sum":
                sql = 'SELECT sum(' + field + ') FROM ' + this.tabname;
                break;
            case "count":
                sql = 'SELECT count(' + field + ') FROM ' + this.tabname;
                break;
        }

        sql = this.makeSql(sql);


        return sql;
    };

    //开始的位置
    S.prototype.start = function (limit) {
        if (this.limitSql) {
            this.limitSql = this.limitSql + " OFFSET " + limit;
        } else {
            this.limitSql = " OFFSET " + limit;
        }
        return this;
    };
    //获取条目数
    S.prototype.num = function (num) {
        if (this.limitSql) {
            this.limitSql = " LIMIT " + num + this.limitSql;
        } else {
            this.limitSql = " LIMIT " + num;
        }

        return this;
    };

    S.prototype.makeSql = function (sql) {
        if (this.whereSql != "") {
            sql = sql+this.whereSql;
        }
        if(this.orderSql!=""){
            sql = sql+this.orderSql;
        }
        if (this.limitSql != "") {
            sql = sql+this.limitSql;
        }

        this.sql = sql;
        this.whereSql = "";
        this.orderSql = "";
        this.limitSql = "";
        return sql;
    }

    /*工具函数*/
    //打印所有数据表
    S.prototype.showTables = function (tabname) {
        if(typeof(tabname)!="string"){
            tabname = "'%'";
        }else{
            tabname = "'%"+tabname+"%'";
        }
        var sql = "SELECT * FROM sqlite_master WHERE type='table' AND name like "+tabname;
        return sql;
    }

    S.prototype.getLastSql = function () {
        return this.sql;
    }

    S.prototype.insert = function (data) {
        if (typeof data != 'object') {
            return false;
        }

        var k = [];
        var v = [];
        for (var i in data) {
            k.push("`" + i + "`");
            v.push("'" + data[i] + "'");
        }
        var sql = "INSERT INTO " + this.tabname + "(" + k.join(',') + ")VALUES(" + v.join(',') + ")";

        this.sql = sql;

        return sql;
    };

    S.prototype.delete = function () {
        var sql = "DELETE FROM " + this.tabname;
        sql = this.makeSql(sql);
        return sql;
    };

    S.prototype.setField = function (field, value) {
        var data = {};
        data[field] = value;
        return this.update(data);
    }

    S.prototype.update = function (data) {
        var setSql = "";
        for (var i in data) {
            var value = data[i];
            switch (typeof(data[i])) {
                case "string":
                    var value = "'" + data[i] + "'";
                    break;
                case "number":
                    var value = data[i];
                    break;
            }
            if (setSql == "") {
                setSql = "`" + i + "`=" + value;
            } else {
                setSql += ",`" + i + "`=" + value;
            }
        }

        var sql = "UPDATE " + this.tabname + " SET " + setSql;
        sql = this.makeSql(sql);
        return sql;
    };

    S.prototype.inc = function (field, num) {
        if (typeof(num) != 'number') {
            num = 1;
        }
        var setSql = field +"="+field + '+' + num;
        var sql = "UPDATE " + this.tabname + " SET " + setSql;
        sql = this.makeSql(sql);
        return sql;
    };

    S.prototype.dec = function (field, num) {
        if (typeof(num) != 'number') {
            num = 1;
        }
        var setSql = field +"="+field + '-' + num;
        var sql = "UPDATE " + this.tabname + " SET " + setSql;
        sql = this.makeSql(sql);
        return sql;
    };

    S.prototype.find = function () {

    };

    S.prototype.count = function (field) {
        return this.makeSelect(field, "count");
    };

    S.prototype.sum = function (field) {
        return this.makeSelect(field, "sum");
    };

    S.prototype.select = function (fieldList) {
        return this.makeSelect(fieldList, "select");
    };

    w.easyDB = S;
})(window);
