import { inject} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot  } from '@angular/router';

import { UserService } from '../services/user.service';


export const ProfileGuard =( next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot)=> {
  const userService= inject(UserService);
  const router = inject(Router);



     if (userService.auth) {
       return true;
     }

     router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then();
     return false;

  }


