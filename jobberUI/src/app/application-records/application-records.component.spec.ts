import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRecordsComponent } from './application-records.component';

describe('ApplicationRecordsComponent', () => {
    let component: ApplicationRecordsComponent;
    let fixture: ComponentFixture<ApplicationRecordsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApplicationRecordsComponent]
        })
            .compileComponents();
    
        fixture = TestBed.createComponent(ApplicationRecordsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
