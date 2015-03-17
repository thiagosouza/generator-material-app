'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var util = require('util');
var ngUtil = require('../util');
var BaseGenerator = require('../base.js');

var Generator = module.exports = function Generator() {
    BaseGenerator.apply(this, arguments);
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
    var self = this;
    var name = this.name;

    var done = this.async();
    var prompts = [
        {
            name: 'dir',
            message: 'Where would you like to create this resource?',
            default: self.config.get('routeDirectory') + name
        },
        {
            name: 'route',
            message: 'What will the url of your route be?',
            default: '/' + name
        },
        {
            name: 'apiUrl',
            message: 'What shall the API url of your resource be?',
            default: '/api/' + name + (self.config.get('pluralizeRoutes') ? 's' : '')
        }
    ];

    this.prompt(prompts, function (props) {
        this.dir = props.dir;
        this.route = props.route;
        this.apiURL = props.apiUrl;
        done();
    }.bind(this));
};

Generator.prototype.registerRoute = function registerRoute() {
    var routeConfig = {
        file: path.join('client', 'app', 'app.js'),
        needle: this.config.get('modulesNeedle'),
        splicable: [
            "\'" + this.scriptAppName + '.' + this.name + "\',"
        ]
    };
    ngUtil.rewriteFile(routeConfig);
};

Generator.prototype.createFiles = function createFiles() {
    this.htmlUrl = path.relative('client', path.join(this.dir, this.name + '.html'));
    this.mainHtmlUrl = path.relative('client', path.join(this.dir, 'main', 'main.html'));
    this.createHtmlUrl = path.relative('client', path.join(this.dir,    'create', 'create.html'));
    this.listHtmlUrl = path.relative('client', path.join(this.dir, 'list', 'list.html'));
    this.listDetailHtmlUrl = path.relative('client', path.join(this.dir, 'list', 'detail', 'detail.html'));
    this.listEditHtmlUrl = path.relative('client', path.join(this.dir, 'list', 'edit', 'edit.html'));
    this.listItemsHtmlUrl = path.relative('client', path.join(this.dir, 'list', 'items', 'items.html'));
    ngUtil.processDirectory(this, 'apiroute', this.dir);
};