import { Component, NgModule, OnInit } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProductAddcomponent } from './product-add.component';



// @Component({

//     selector: 'product-add.component',
//     templateUrl: './product-add.component.html'


// })
@NgModule({
    imports: [
        ImageCropperModule
    ],
    declarations: [ProductAddcomponent],
    exports: []
})
export class ProductAddModule {}