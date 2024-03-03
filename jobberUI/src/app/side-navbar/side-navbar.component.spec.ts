import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SideNavbarComponent } from './side-navbar.component';

describe('SideNavbarComponent', () => {
    let component: SideNavbarComponent;
    let fixture: ComponentFixture<SideNavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SideNavbarComponent]
        })
            .compileComponents();
    
        fixture = TestBed.createComponent(SideNavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display username and initials', () => {
        component.username = 'John Doe';
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        const avatarElement = compiled.querySelector('.avatar');
        expect(avatarElement.textContent.trim()).toBe('JD');
    });

    it('should call handleSidebarToggle when the toggle is clicked', () => {
        spyOn(component, 'handleSidebarToggle');
        const button = fixture.debugElement.query(By.css('.toggle'));
        button.triggerEventHandler('click', null);
        expect(component.handleSidebarToggle).toHaveBeenCalled();
    });

    it('should display brand logo', () => {
        const compiled = fixture.debugElement.nativeElement;
        const logoElement = compiled.querySelector('.header img');
        expect(logoElement).toBeTruthy();
    });
  
    it('should display sidebar title', () => {
        const compiled = fixture.debugElement.nativeElement;
        const titleElement = compiled.querySelector('.header .title');
        expect(titleElement.textContent.trim()).toBe('Jobber');
    });
  
    it('should display icons and titles for links', () => {
        const compiled = fixture.debugElement.nativeElement;
        const linkElements = compiled.querySelectorAll('.content');
        expect(linkElements.length).toBe(6);
  
        const iconElements = compiled.querySelectorAll('.content .icon i');
        expect(iconElements.length).toBe(5);
  
        const titleElements = compiled.querySelectorAll('.content .title');
        expect(titleElements.length).toBe(5);
    });

});
