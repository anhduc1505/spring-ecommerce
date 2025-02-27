package com.aduc.ecommerce.dao;

import com.aduc.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.Pageable;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    //select * from product p where p.name like CONCAT('%', :name, '%')
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);

}
