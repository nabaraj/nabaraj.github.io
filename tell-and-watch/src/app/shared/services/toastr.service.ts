import {Injectable} from '@angular/core'
declare let toastr:any

@Injectable()
export class ToastrService{
  // toastr.options = {
  //     "progressBar": true
  // }


  success(message: string, title?: string){
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "300",
      "timeOut": "0",
      "extendedTimeOut": "0",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    toastr.success(message, title)
  }
  info(message: string, title?: string){
    toastr.info(message, title)
  }
  clear(){
    toastr.clear();
  }
  warning(message: string, title?: string){
    toastr.warning(message, title)
  }
  error(message: string, title?: string){
    toastr.error(message, title)
  }
}
