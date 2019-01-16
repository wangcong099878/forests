/**
 * Created by wangcong on 2018/08/02.
 * apicloud 异步操作库
 */
;var globalDB;
(function (w) {


    var DBquery = function (dbname, sql, func) {
        if (sql.indexOf("SELECT") != -1) {
            globalDB.selectSql({
                name: dbname,
                sql: sql
            }, function (ret, err) {
                var result = {
                    ret: ret,
                    err: err
                }
                func(result);
            });
        } else {
            globalDB.executeSql({
                name: dbname,
                sql: sql
            }, function (ret, err) {
                var result = {
                    ret: ret,
                    err: err
                }
                func(result);
            });
        }
    }

    //exec
    var DBexec = function (dbname, sql, func) {
        globalDB.executeSql({
            name: dbname,
            sql: sql
        }, function (ret, err) {
            var result = {
                ret: ret,
                err: err
            }
            func(result);
        });
    }

    //全局打开数据库
    var DBinit = function (dbname, func) {
        DBDefaultConfig.dbname = dbname;
        globalDB.openDatabase({
            name: dbname
        }, function (ret, err) {
            var result = {
                ret: ret,
                err: err
            }
            func(result);
        });
    };

    var DBShowTables = function (tabname,func) {
        if(typeof(tabname)!="string"){
            tabname = "'%'";
        }else{
            tabname = "'%"+tabname+"%'";
        }
        var sql = "SELECT * FROM sqlite_master WHERE type='table' AND name like "+tabname;
        return DBquery(DBDefaultConfig.dbname, sql,func);
    }

    //构造函数  可以传字符串或者对象    只传字符串则为表名
    var S = function (config) {
        switch (typeof(config)) {
            case "object":
                this.construct(config);
                break;
            case "string":
                this.construct();
                this.tabname = config;
                break;
            default:
                alert("请传入正确的参数");
        }
        this.DB = new easyDB({
            tabname: this.tabname,
            dbname: this.dbname
        });
        return this;
    }
    //构建类属性
    S.prototype.construct = function (config) {
        this.config = DBDefaultConfig;
        var config = config ? config : {};

        for (var i in DBDefaultConfig) {
            if (config[i]) {
                this.config[i] = config[i];
            }
        }

        this.tabname = this.config.tabname;  //数据表名称
        this.dbname = this.config.dbname;    //数据库名称
        this.dbsize = "1024 * 1024 * 4";
        this.whereSql = "";
        this.sql = "";
        this.limitSql = "";
    }

    var DBDefaultConfig = {
        tabname: "demo",
        dbname: "youshang",
        result: {},
        ret: {},
        err: {},
    };


    //覆盖default中的配置
    S.prototype.create = function (config) {
        return this;
    }

    S.prototype.order = function (orderSql) {
        this.DB.order(orderSql);
        return this;
    };

    S.prototype.where = function (field, condition, value) {
        this.DB.where(field, condition, value);
        return this;
    };

    S.prototype.orWhere = function (field, condition, value) {
        this.DB.orWhere(field, condition, value);
        return this;
    };

    //获取的位置
    S.prototype.start = function (limit) {
        this.DB.start(limit);
        return this;
    };
    //获取条目数
    S.prototype.num = function (num) {
        this.DB.num(num);
        return this;
    };

    /*工具函数*/
    //打印所有数据表
    S.prototype.showTables = function (tabname, func) {
        if (typeof(func) == "undefined") {
            func = tabname;
            tabname = 0;
        }
        var sql = this.DB.showTables(tabname);
        DBquery(this.dbname, sql, func);
        return sql;
    }

    /*添加数据*/
    S.prototype.insert = function (data, func) {
        var sql = this.DB.insert(data);
        DBquery(this.dbname, sql, func);
        return sql;
    };
    /*删除数据*/
    S.prototype.delete = function (func) {
        var sql = this.DB.delete();
        DBquery(this.dbname, sql, func);
        return sql;
    };

    /*修改数据*/
    //修改一个字段
    S.prototype.setField = function (field, value, func) {
        var sql = this.DB.setField(field, value);
        DBquery(this.dbname, sql, func);
        return sql;
    }

    //更新部分数据
    S.prototype.update = function (data, func) {
        var sql = this.DB.update(data);
        DBquery(this.dbname, sql, func);
        return sql;
    };

    /*查询方法*/
    S.prototype.inc = function (field, num, func) {
        if (typeof(func) == 'undefined') {
            func = num;
        }
        if (typeof(num) != 'number') {
            num = 1;
        }
        var sql = this.DB.inc(field, num);
        DBquery(this.dbname, sql, func);
        return sql;
    };

    S.prototype.dec = function (field, num, func) {
        if (typeof(func) == 'undefined') {
            func = num;
        }
        if (typeof(num) != 'number') {
            num = 1;
        }

        var sql = this.DB.dec(field, num);

        DBquery(this.dbname, sql, func);
        return sql;
    };

    //获取一条  传入字段数组 不传为空则获取全部
    S.prototype.find = function (fieldList, func) {
        return this.select(fieldList, function (ret) {
            if (typeof(ret.data[0]) == "object") {
                func(ret.data[0]);
            } else {
                func(false);
            }
        });
    };

    //获取一个字段的子
    S.prototype.getField = function (field, func) {
        return this.select(field, function (ret) {
            if (typeof(ret.data[0][field]) != 'undefined') {
                func(ret.data[0][field]);
            } else {
                func(false);
            }
        });
    };

    //获取一列字段的数组
    S.prototype.pluck = function (field, func) {
        return this.select(field, function (resultData) {
            if (typeof(resultData.ret.data) != 'undefined') {
                var result = new Array();
                var data = resultData.ret.data;
                for (x in data) {
                    if (typeof(data[x][field]) != 'undefined') {
                        result.push(data[x][field]);
                    }
                }
                func(result);
            } else {
                func(false);
            }
        });
    }

    S.prototype.count = function (field, func) {
        var sql = this.DB.count(field);
        DBquery(this.dbname, sql, func);
        return sql;
    };

    S.prototype.sum = function (field, func) {
        var sql = this.DB.sum(field);
        DBquery(this.dbname, sql, func);
        return sql;
    };

    S.prototype.select = function (fieldList, func) {
        if (typeof(func) == 'undefined') {
            func = fieldList;
            var sql = this.DB.select();
        }
        if (typeof(fieldList) == 'string') {
            var sql = this.DB.select(fieldList);
        }
        if (typeof(fieldList) == 'object') {
            if (fieldList.length > 1) {
                fieldList = fieldList.join(",");
            } else {
                fieldList = fieldList.join("");
            }
            var sql = this.DB.select(fieldList);
        }
        DBquery(this.dbname, sql, func);
        return sql;
    };

    w.apiDB = S;
    w.DBquery = DBquery;
    w.DBinit = DBinit;
    w.DBexec = DBexec;
})(window);
