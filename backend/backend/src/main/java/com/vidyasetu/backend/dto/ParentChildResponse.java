
package com.vidyasetu.backend.dto;

public class ParentChildResponse {

    private Long id;
    private String name;
    private String className;
    private String village;

    public ParentChildResponse() {
    }

    public ParentChildResponse(
            Long id,
            String name,
            String className,
            String village) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.village = village;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getClassName() {
        return className;
    }

    public String getVillage() {
        return village;
    }
}
