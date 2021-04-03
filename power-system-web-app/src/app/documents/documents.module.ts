import { ChooseWorkRequestDialogComponent } from 'app/documents/dialogs/choose-work-request-dialog/choose-work-request-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { WorkRequestsComponent } from './work-requests/work-requests/work-requests.component';
import { WorkPlansComponent } from './work-plans/work-plans.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkPlanComponent } from './work-plans/work-plan/work-plan.component';
import { MatTabsModule } from '@angular/material/tabs';
import { WorkPlanBasicInformationComponent } from './work-plans/work-plan-basic-information/work-plan-basic-information.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import { ChooseIncidentDialogComponent } from './dialogs/choose-incident-dialog/choose-incident-dialog.component';
import { StateChangeComponent } from './state-change/state-change.component';
import { WorkPlanStateChangesComponent } from './work-plans/work-plan-state-changes/work-plan-state-changes.component';
import { WorkPlanSwitchingInstructionsComponent } from './work-plans/work-plan-switching-instructions/work-plan-switching-instructions.component';
import { SwitchingInstructionComponent } from './switching-instruction/switching-instruction.component';




@NgModule({
  declarations: [
    WorkPlansComponent,
    WorkRequestsComponent,
    WorkPlanComponent,
    WorkPlanBasicInformationComponent,
    ChooseIncidentDialogComponent,
    ChooseWorkRequestDialogComponent,
    StateChangeComponent,
    WorkPlanStateChangesComponent,
    WorkPlanSwitchingInstructionsComponent,
    SwitchingInstructionComponent
  ],
  exports: [
    WorkPlansComponent,
    WorkRequestsComponent,
    WorkPlanComponent 
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatExpansionModule,
    MatRadioModule,
    RouterModule,
    MatProgressSpinnerModule,   
    MatTabsModule,
    MatDatepickerModule,     
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class DocumentsModule {
}
