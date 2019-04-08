import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { DetailComponent } from '../detail/detail.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: '', component: ContactComponent },
  { path: 'details/:id', component: DetailComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
