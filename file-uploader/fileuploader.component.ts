import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import "./fileuploader.component.less";

let WebUploader = require("./webuploader.html5.js");

@Component({
  selector: 'file-uploader',
  template: "<div id = '{{id}}' class = 'zbase-file-uploader'><span class = 'fu-label'>{{label}}</span></div>",
  styleUrls: ["./fileuploader.component.less"]
})

export class FileUploaderComponent implements AfterViewInit, OnInit, OnDestroy {
  static num: number = 0;
  static getUUID(): string {
    return "fu_" + (FileUploaderComponent.num++);
  }
  /**
   *  允许上传的类型：
   *   1. image： [默认]，包括所有图片类型（jpg/jpeg/ico/gif/png/bmp）
   *   2. *：不限制类型
   *   3. 类型列表，如："image/jpg,image/gif"等，参见http://www.iana.org/assignments/media-types/media-types.xhtml
   */
  @Input() accept: string = "image";
  /**
   * 是否允许一次选择多个文件上传。默认为true
   */
  @Input() multiple: boolean = true;
  /**
   * 上传文件时，文件对应的字段的名称。默认为"file"
   */
  @Input("file-name") fileName: string = "file";
  /**
   * 文件上传的后台地址。
   */
  @Input("server-url") serverUrl: string = "";
  /**
   * 文件上传时，附带的表单其他信息。
   */
  @Input("form-data") formData: {};
  /**
   * 每次上传的文件数量，默认为1个。
   */
  @Input("file-num-limit") fileNumLimit: number = 1;
  /**
   * 按钮的文字，默认“上传图片”
   */
  @Input("label") label: string = "上传图片";
  /**
   * 每个文件的大小限制，默认为2M。byte类型
   */
  @Input("one-file-size") fileSingleSizeLimit: number = 2 * 1024 * 1024;

  /**
   * 每上传成功一个文件时触发，会返回
   * {
   *    file: 当前上传的文件对象，具体参见http://fex.baidu.com/webuploader/doc/index.html#WebUploader_File
   *    response: 服务器返回的数据，结构如：
   *        {
   *            _raw: 字符串，原始response的内容,
   *            ...内容转换为json后的属性
   *        }
   * }
   */
  @Output("onUploadOneSuccess") onUploadOneSuccess = new EventEmitter();
  /**
   * 当所有文件上传完成时触发。
   */
  @Output("onUploadAllFinished") onUploadAllFinished = new EventEmitter();
  /**
   * 在开始所有的上传任务前触发。
   */
  @Output("onStartAllUpload") onStartAllUpload = new EventEmitter();
  /**
   * 当发生错误时触发。
   */
  @Output("onError") onError = new EventEmitter();
  /**
   * 当uploader初始化完成时触发。
   */
  @Output("onUploaderReady") onUploaderReady = new EventEmitter();

  private imageTypes: string[] = ["image/jpg", "image/gif", "image/jpeg", "image/png", "image/ico", "image/bmp"];
  private id: string;
  private uploader: any;
  constructor() {
    this.id = FileUploaderComponent.getUUID();
  }

  ngOnInit() {
  }

  private initUploader() {
    this.uploader = WebUploader.create({
      auto: true,
      server: this.serverUrl,
      pick: { id: '#' + this.id, multiple: this.multiple },
      fileVal: this.fileName,
      formData: this.formData,
      resize: false,
      fileNumLimit: this.fileNumLimit
    });
  }

  private bindEvent() {
    this.uploader.on('onUploaderReady', () => {
      this.onUploaderReady.emit();
    });
    this.uploader.on('error', () => {
      this.onError.emit();
    });
    this.uploader.on('startUpload', () => {
      this.onStartAllUpload.emit();
    });
    this.uploader.on('uploadFinished', () => {
      this.onUploadAllFinished.emit();
    });
    this.uploader.on('uploadSuccess', (file, response) => {
      this.onUploadOneSuccess.emit({
        file: file,
        response: response
      });
    });
    this.uploader.on("beforeFileQueued", (file) => {
      if (this.accept === "*"
        || this.accept === "image" && this.imageTypes.find(r => r === file.type)
        || this.accept.split(",").find(r => r === file.type)) return true;
      return false;
    });
  }

  ngAfterViewInit() {
    this.initUploader();
    this.bindEvent();
  }

  ngOnDestroy() {
    this.uploader.destroy();
  }
}