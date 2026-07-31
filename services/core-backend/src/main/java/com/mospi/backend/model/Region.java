package com.mospi.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "regions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // STATE
    private String stateName;
    private String stateCode;   // LGD code

    // DISTRICT
    private String districtName;
    private String districtCode; // LGD code

    // BLOCK
    private String blockName;
    private String blockCode;

    // VILLAGE
    private String villageName;
    private String villageCode;
}