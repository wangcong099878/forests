/**
 * Created by wangcong on 2018/08/02.
 * html5操作库
 */
;(function (w) {
    var _config = {
        dbsize: "1024 * 1024 * 4",
        tabname: "demo",
        dbname: "youshang",
        result: {},
        ret: {},
        err: {},
    };

    var DBquery = function (sql, param, callback) {
        //参数处理
        if (!param) {
            param = [];
        } else if (typeof param == 'function') {
            callback = param;
            param = [];
        }

        //只有一个参数
        globalDB.transaction(function (tx) {
            //4个参数：sql，替换sql中问号的数组，成功回调，出错回调
            tx.executeSql(sql, param, function (tx, result) {
                if (typeof callback == 'function') {
                    callback(result);
                }else{
                    console.log(result);
                }
            }, function (err) {
                console.log(err);
            });
        })
        return true;
    }

    //全局打开数据库
    var DBinit = function (dbname, dbsize) {
        globalDB = openDatabase(dbname, '1.0.0', '', dbsize);
    };

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
        var config = config ? config : {};
        var target = {};
        this.config = Object.assign(target, _config, config);
        this.tabname = this.config.tabname;  //数据表名称
        this.dbname = this.config.dbname;    //数据库名称
        this.dbsize = "1024 * 1024 * 4";
        this.whereSql = "";
        this.sql = "";
        this.limitSql = "";
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
    S.prototype.showTables = function (tabname,func) {
        if(typeof(func)=="undefined"){
            func = tabname;
            tabname = 0;
        }
        var sql = this.DB.showTables(tabname);
        DBquery(sql, func);
        return sql;
    }

    /*添加数据*/
    S.prototype.insert = function (data, func) {
        var sql = this.DB.insert(data);
        DBquery(sql, func);
        return sql;
    };
    /*删除数据*/
    S.prototype.delete = function (func) {
        var sql = this.DB.delete();
        DBquery(sql, func);
        return sql;
    };

    /*修改数据*/
    //修改一个字段
    S.prototype.setField = function (field, value, func) {
        var sql = this.DB.setField(field, value);
        DBquery(sql, func);
        return sql;
    }

    //更新部分数据
    S.prototype.update = function (data, func) {
        var sql = this.DB.update(data);
        DBquery(sql, func);
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
        DBquery(sql, func);
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

        DBquery(sql, func);
        return sql;
    };

    //获取一条  传入字段数组 不传为空则获取全部
    S.prototype.find = function (fieldList,func) {
        return this.select(fieldList,function(ret){
            if(typeof(ret.rows[0])=="object"){
                func(ret.rows[0]);
            }else{
                func(false);
            }
        });
    };
    //获取一个字段的子
    S.prototype.getField = function (field,func) {
        return this.select(field,function(ret){
            if(typeof(ret.rows[0][field]) != 'undefined'){
                func(ret.rows[0][field]);
            }else{
                func(false);
            }
        });
    };

    //获取一列字段的数组
    S.prototype.pluck = function(field,func){
        return this.select(field,function(ret){
            if(typeof(ret.rows) != 'undefined'){
                var result = new Array();
                var data = ret.rows;
                for (x in data){
                    if(typeof(data[x][field]) != 'undefined'){
                        result.push(data[x][field]);
                    }
                }
                func(result);
            }else{
                func(false);
            }
        });
    }

    S.prototype.count = function (field, func) {
        var sql = this.DB.count(field);
        DBquery(sql, func);
        return sql;
    };

    S.prototype.sum = function (field, func) {
        var sql = this.DB.sum(field);
        DBquery(sql, func);
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
            if(fieldList.length>1){
                fieldList = fieldList.join(",");
            }else{
                fieldList = fieldList.join("");
            }
            var sql = this.DB.select(fieldList);
        }
        DBquery(sql, func);
        return sql;
    };

    w.H5DB = S;
    w.DBquery = DBquery;
    w.DBinit = DBinit;
})(window);
