﻿/********************************************************************
 License: https://github.com/chengderen/Smartflow/blob/master/LICENSE 
 Home page: https://www.smartflow-sharp.com
 ********************************************************************
 */
$(function () {

    function Page(option) {
        this.userID = util.doQuery("id");
        this.setting = $.extend({}, option);
        this.init();
    }

    Page.prototype.bind = function () {
        var $this = this;
        $.each($this.setting.event, function (propertyName) {
            var selector = '#' + propertyName;
            $(selector).click(function () {
                $this.setting.event[propertyName].call($this);
            });
        });
    }

    Page.prototype.init = function () {
        var form = layui.form;
        form.render('radio', 'form-center-search');
        this.bind();
        this.bindButtonGroup();
        this.loadTask(this.userID);
        $("#form-center-search input[type=radio]:eq(0)").next('.layui-form-radio').trigger('click');
    }
    Page.prototype.bindButtonGroup = function () {
        var $this = this;
        var form = layui.form;
        form.on('radio', function (data) {
            $this.load(data.value, $this.userID);
        });
    }

    Page.prototype.delete = function (data) {
        var $this = this,
            config = $this.setting.config;
        util.ajaxWFService({
            url: config.delete,
            type: 'delete',
            data: JSON.stringify(data),
            success: function () {
                layui.table.reload(config.task);
            }
        });
    }
    Page.prototype.load = function (type, actor) {
        var config = this.setting.config;
        var selector = '#' + config.id;
        var table = layui.table;
        var $this = this;
        util.table({
            elem: selector
            , page: true
            , url: config.url
            , where: {
                arg: JSON.stringify({ type: type, actor: actor })
            }
            , cols: [[
                { width: 50, type: 'numbers', sort: false, title: '序号', align: 'center', unresize: true }
                , { field: 'CategoryName', width: 120, title: '业务类型', sort: false, align: 'center' }
                , { field: 'OrganizationName', width: 140, title: '所属单位', sort: false, align: 'center' }
                , { field: 'RealName', width: 100, title: '创建人', sort: false, align: 'center' }
                , {
                    field: 'Comment', title: '标题', minWidth: 140, align: 'left', event: 'jump', templet: function (d) {
                        return "<span class=\"jump-click\">" + d.Comment + "</span>";
                    }
                }
                , {
                    field: 'CreateDateTime', title: '创建时间', width: 180, align: 'center',
                    templet: function (d) { return layui.util.toDateString(d.CreateDateTime, 'yyyy.MM.dd HH:mm:ss'); }
                }
                , { field: 'StateName', width: 100, title: '运行状态', align: 'center', unresize: true }
                , {
                    field: 'NodeName', width: 160, title: '执行节点', align: 'center', unresize: true,
                    templet: function (d) {
                        if (d.State.toLowerCase() == 'reject') {
                            return d.NodeName + "<font color='red'>(否决)</font>";
                        } else {
                            return d.NodeName;
                        }
                    }
                }
            ]]
        });
        table.on('tool(pending-table)', function (obj) {
            var data = obj.data;
            var eventName = obj.event;
            if (eventName === 'jump') {
                $this.jump(data);
            }
        });
    }

    Page.prototype.jump = function (obj) {
        var config = this.setting.config;
        util.ajaxWFService({
            url: config.category + '/' + obj.CategoryID,
            type: 'get',
            success: function (data) {
                util.openDetailFullLayer(data.Url, {
                    id: obj.Key,
                    code: obj.CategoryID,
                    instanceID: obj.InstanceID
                }, obj.CategoryName);
            }
        });
    }
    Page.prototype.refresh = function () {
        layui.table.reload(this.setting.config.id);
    }
    Page.prototype.loadTask = function (actor) {
        var $this = this;
        var config = this.setting.config;
        var selector = '#' + config.task;
        var table = layui.table;
        util.table({
            elem: selector
            , page: true
            , url: config.url
            , where: {
                arg: JSON.stringify({ type: 5, actor: actor})
            }
            , cols: [[
                { type: 'radio' },
                { width: 50, type: 'numbers', sort: false, title: '序号', align: 'center', unresize: true }
                , { field: 'CategoryName', width: 120, title: '业务类型', sort: false, align: 'center' }
                , { field: 'OrganizationName', width: 140, title: '所属单位', sort: false, align: 'center' }
                , { field: 'RealName', width: 100, title: '创建人', sort: false, align: 'center' }
                , {
                    field: 'Comment', title: '标题', minWidth: 140, align: 'left', event: 'jump', templet: function (d) {
                        return "<span class=\"jump-click\">" + d.Comment + "</span>";
                    }
                }
                , {
                    field: 'CreateDateTime', title: '创建时间', width: 180, align: 'center',
                    templet: function (d) { return layui.util.toDateString(d.CreateDateTime, 'yyyy.MM.dd HH:mm:ss'); }
                }
                , { field: 'StateName', width: 100, title: '运行状态', align: 'center', unresize: true }
                , {
                    field: 'NodeName', width: 160, title: '执行节点', align: 'center', unresize: true,
                    templet: function (d) {
                        if (d.State.toLowerCase() == 'reject') {
                            return d.NodeName + "<font color='red'>(否决)</font>";
                        } else {
                            return d.NodeName;
                        }
                    }
                }
            ]]
        });
        table.on('tool(task-table)', function (obj) {
            var data = obj.data;
            var eventName = obj.event;
            if (eventName === 'jump') {
                $this.jump(data);
            }
        });
    }
    Page.check = function (id, callback) {
        var checkStatus = layui.table.checkStatus(id);
        var dataArray = checkStatus.data;
        if (dataArray.length == 0) {
            layer.msg(util.message.record);
        } else {
            callback && callback(dataArray[0]);
        }
    }

    var page = new Page({
        config: {
            id: 'pending-table',
            task: 'task-table',
            delete: 'api/summary/delete',
            url: 'api/summary/paging',
            pending: 'api/pending/getpending',
            category: 'api/category/get'
        },
        event: {
            delete: function () {
                var $this = this;
                Page.check('task-table', function (data) {
                    util.confirm(util.message.delete, function () {
                        $this.delete({
                            instanceID: data.InstanceID,
                            key: data.Key,
                            categoryID: data.CategoryID
                        });
                    });
                });
            }
        }
    });

    //刷新
    window.invoke = function () {
        page.refresh();
    }
});
