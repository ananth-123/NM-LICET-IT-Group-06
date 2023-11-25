package com.example.todo.models;

import java.util.Date;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "todos")
@JsonIgnoreProperties(value = { "createdAt" }, allowGetters = true)
public class Todo {
    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String title;

    private Boolean completed = false;

    private Date createdAt = new Date();

    private Date deadline;

    private String priority = "Normal";

    public Todo() {
        super();
    }

    public Todo(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        return String.format(
                "Todo[id=%s, title='%s', completed='%s', deadline='%s', priority='%s']",
                id, title, completed, deadline, priority);
    }
}
