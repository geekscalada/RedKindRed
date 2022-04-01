import { Component, NgModule, OnInit } from '@angular/core';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { ProductAddModule } from './product-add.module';



@Component({

    selector: 'product-add.component',
    templateUrl: './product-add.component.html'


})
export class ProductAddcomponent implements OnInit {
    
    public imageChangedEvent: any = '';
    public fileToUpload: File | undefined;

    public croppedImage: any = '';




    uploadFile(event: any) {

        this.imageChangedEvent = event;

        // This going away soon bye bye
        this.fileToUpload = event.target.files[0]
    }
    
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(this.croppedImage)
    }

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }


}