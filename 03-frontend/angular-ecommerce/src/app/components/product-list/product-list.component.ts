import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // Pagination variables
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;  // ✅ Đảm bảo giá trị mặc định không bị undefined

  previousKeyword: string = "";

  constructor(private productService: ProductService, 
              private cartService : CartService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProduct();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`Keyword=${theKeyword}, Page Number=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(
      this.thePageNumber - 1, 
      this.thePageSize,
      theKeyword
    ).subscribe(data => this.processResult()(data));  // ✅ Sửa lỗi cách gọi
  }

  handleListProduct() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : 1;

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`Current Category ID=${this.currentCategoryId}, Page Number=${this.thePageNumber}`);

    this.productService.getProductListPaginate(
      this.thePageNumber - 1, 
      this.thePageSize, 
      this.currentCategoryId
    ).subscribe(data => this.processResult()(data));  // ✅ Sửa lỗi cách gọi
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;  // ✅ Đảm bảo `collectionSize` có giá trị
    };
  }

  addToCart(theProduct: Product) {
    console.log(`Add to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);


    this.cartService.addToCart(theCartItem);

  }
  
}
