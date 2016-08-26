# ng2-html5-file-uploader-component

说明：

1. 基于 https://github.com/fex-team/webuploader ，仅使用了html5的部分。
2. 基于 angular2-rc5
3. 样式文件为less，改成css也很容易。

使用：

```
ts:
    import { FileUploaderComponent } from "fileuploader.component";

    /* add declarations for your module or declarations and exports in your shared module */

html:


    <file-uploader server-url = "" multiple = false [form-data] = "formData" file-name = "user_thumbnail" (onUploadOneSuccess) = "onUploadOneImageSuccess($event)" label = "upload image" ></file-uploader>

```