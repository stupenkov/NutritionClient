import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnergyValueDto } from 'src/app/Dto/EnergyValueDto';
import { NewProductDto } from 'src/app/Dto/NewProductDto';
import { ProductDto } from 'src/app/Dto/ProductDto';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  @Input() product: ProductDto;
  @Output() onAdded = new EventEmitter();
  form: FormGroup;
  isAdding: boolean;

  constructor(private productService: ProductService, private formBuilder: FormBuilder) {
    this.initForm();
  }

  initForm() {
    let initProduct: ProductDto;
    if (this.product) {
      initProduct = this.product;
    }
    else {
      initProduct = new ProductDto(0, '', 0, new EnergyValueDto(0, 0, 0, 0));
    }

    this.form = this.formBuilder.group({
      'id': new FormControl(initProduct.id),
      "name": new FormControl(initProduct.name, Validators.required),
      "cost": new FormControl(initProduct.cost, Validators.min(0)),
      "proteins": new FormControl(initProduct.energyValue.proteins, Validators.min(0)),
      "fats": new FormControl(initProduct.energyValue.fats, Validators.min(0)),
      "carbohydrates": new FormControl(initProduct.energyValue.carbohydrates, Validators.min(0)),
    });
  }

  setProduct(product: ProductDto) {
    this.product = product;
    this.initForm();
    console.log(this.product);
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.isAdding = true;
    const product = new NewProductDto(
      this.form.controls['name'].value,
      Number(this.form.controls['cost'].value),
      Number(this.form.controls['proteins'].value),
      Number(this.form.controls['fats'].value),
      Number(this.form.controls['carbohydrates'].value));

    console.log(product);
    const result = await this.productService.create(product);
    console.log(result);
    this.isAdding = false;
    this.onAdded.emit();
    this.form.clearValidators();
    this.form.reset({ id: 0, name: '', cost: 0, proteins: 0, fats: 0, carbohydrates: 0 });
  }

  ngOnInit(): void {
  }
}