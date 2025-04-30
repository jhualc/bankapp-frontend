import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerFormComponent } from '../../customers/customer-form/customer-form.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerFormComponent, // ✅ Standalone component
        HttpClientTestingModule, // ✅ Para servicios que usen HttpClient
      ],
      providers: [
        {
          provide: DialogRef, // ✅ Mock DialogRef para evitar NullInjectorError
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: ActivatedRoute, // ✅ Mock básico para evitar NullInjectorError
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
