/**
 * Created by wangcong on 2018/08/02.
 * apicloud 同步操作库
 */
;
var globalDB;
(function(w) {
    var _config = {
        tabname: "demo",
        dbname: "youshang",
        result: {},
        ret: {},
        err: {},
    };

    var DBquery = function(dbname, sql) {
        if (sql.indexOf("SELECT") != -1) {
            return globalDB.selectSqlSync({
                name: dbname,
                sql: sql
            });
        } else {
            return globalDB.executeSqlSync({
                name: dbname,
                sql: sql
            });
        }
    }

    //exec
    var DBexec = function(dbname, sql) {
        return globalDB.executeSqlSync({
            name: dbname,
            sql: sql
        });
    }

    //全局打开数据库
    var DBinit = function(dbname) {
        return globalDB.openDatabaseSync({
            name: dbname
        });
    };

    //构造函数  可以传字符串或者对象    只传字符串则为表名
    var S = function(config) {
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
    S.prototype.construct = function(config) {
        var config = config ? config : {};
        var target = {};

        for (var i in _config) {
            if (config[i]) {
                _config[i] = config[i];
            }
        }
        this.config = _config;
        this.tabname = this.config.tabname; //数据表名称
        this.dbname = this.config.dbname; //数据库名称
        this.whereSql = "";
        this.sql = "";
        this.limitSql = "";
    }

    S.prototype.order = function(orderSql) {
        this.DB.order(orderSql);
        return this;
    };

    S.prototype.where = function(field, condition, value) {
        this.DB.where(field, condition, value);
        return this;
    };

    S.prototype.orWhere = function(field, condition, value) {
        this.DB.orWhere(field, condition, value);
        return this;
    };

    //获取的位置
    S.prototype.start = function(limit) {
        this.DB.start(limit);
        return this;
    };
    //获取条目数
    S.prototype.num = function(num) {
        this.DB.num(num);
        return this;
    };

    /*工具函数*/
    //打印所有数据表
    S.prototype.showTables = function(tabname) {
        var sql = this.DB.showTables(tabname);
        return DBquery(this.dbname, sql);
    }

    /*添加数据*/
    S.prototype.insert = function(data) {
        var sql = this.DB.insert(data);
        var ret = DBexec(this.dbname, sql);

        if (ret.status == true) {
            sql = this.DB.order("id desc").num(1).select();
            return DBquery(this.dbname, sql).data.pop();
        } else {
            return ret;
        }

        // return globalDB.selectSqlSync({
        //     name: this.dbname,
        //     sql: 'SELECT last_insert_rowid() from '+this.tabname
        // });

        // if(ret.status==true){
        //     var idsql = 'select last_insert_rowid() from '+this.tabname;
        //     return DBquery(this.dbname, idsql);
        // }else{
        //     return false;
        // }
    };
    /*删除数据*/
    S.prototype.delete = function() {
        var sql = this.DB.delete();
        return DBquery(this.dbname, sql);
    };

    /*修改数据*/
    //修改一个字段
    S.prototype.setField = function(field, value) {
        var sql = this.DB.setField(field, value);
        return DBquery(this.dbname, sql);
    }

    //更新部分数据
    S.prototype.update = function(data) {
        var sql = this.DB.update(data);
        return DBquery(this.dbname, sql);
    };

    /*查询方法*/
    S.prototype.inc = function(field, num) {
        if (typeof(num) != 'number') {
            num = 1;
        }
        var sql = this.DB.inc(field, num);
        return DBquery(this.dbname, sql);
    };

    S.prototype.dec = function(field, num) {
        if (typeof(num) != 'number') {
            num = 1;
        }
        var sql = this.DB.dec(field, num);
        return DBquery(this.dbname, sql);
    };

    //获取一条  传入字段数组 不传为空则获取全部
    S.prototype.find = function(fieldList) {
        var ret = this.select(fieldList);
        if (typeof(ret.data[0]) == "object") {
            return ret.data[0];
        } else {
            return null;
        }
    };

    //获取一个字段
    S.prototype.getField = function(field) {
        var ret = this.select(field);
        if (typeof(ret.data[0][field]) != 'undefined') {
            return ret.data[0][field];
        } else {
            return null;
        }
    };

    S.prototype.count = function(field) {
        var sql = this.DB.count(field);
        return DBquery(this.dbname, sql);
    };

    S.prototype.sum = function(field) {
        var sql = this.DB.sum(field);
        return DBquery(this.dbname, sql);
    };

    S.prototype.select = function(fieldList) {
        var sql = "";
        if (typeof(fieldList) == 'undefined') {
            sql = this.DB.select();
        }
        if (typeof(fieldList) == 'string') {
            sql = this.DB.select(fieldList);
        }
        if (typeof(fieldList) == 'object') {
            if (fieldList.length > 1) {
                fieldList = fieldList.join(",");
            } else {
                fieldList = fieldList.join("");
            }
            sql = this.DB.select(fieldList);
        }
        return DBquery(this.dbname, sql);
    };

    w.apiDB = S;
    w.DBquery = DBquery;
    w.DBinit = DBinit;
    w.DBexec = DBexec;
})(window);
