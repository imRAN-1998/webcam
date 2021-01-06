import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,AfterViewInit {
  title = 'project-capture-camera';

  
  // @ViewChild("video")
  // public video: ElementRef;

  // @ViewChild("canvas")
  // public canvas: ElementRef;

  public captures: Array<any>;


    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;
    public videoOptions: MediaTrackConstraints = {
      // width: {ideal: 1024},
      // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];
  
    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor() {
      this.captures = [];
  }

  ngOnInit() {

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
   }

  ngAfterViewInit() {
      // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      //       console.log(this.video);
      //       try {
      //         this.video.nativeElement.srcObject = stream;
      //       } catch (error) {
      //         this.video.nativeElement.src = window.URL.createObjectURL(stream);
      //       }
      //         // this.video.nativeElement.src = window.URL.createObjectURL(stream);
      //         this.video.nativeElement.play();
      //     });
      // }
  }

  // public capture() {
  //     var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
  //     console.log(this.canvas);
  //     console.log(context);
  //     this.captures.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
  //     console.log(this.captures);
  // }



  
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  newArray : any = [];
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    // this.pictureTaken.emit(webcamImage);
    this.captures.push(webcamImage);
    console.log(this.captures);
    // this.captures.forEach(Data=>{
    //   this.newArray.push(Data._imageAsDataUrl);
    // })
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }
}
