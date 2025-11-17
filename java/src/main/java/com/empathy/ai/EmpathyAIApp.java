package com.empathy.ai;

import java.util.Map;
import java.util.Scanner;

public class EmpathyAIApp {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Enter your name: ");
            String name = scanner.nextLine().trim();
            if (name.isEmpty()) name = "User";

            EmpathyAI ai = new EmpathyAI(name);
            System.out.println("Hi " + name + "! Type your message or 'exit' to quit.");

            while (true) {
                System.out.print("You: ");
                String line = scanner.nextLine();
                if (line == null) break;
                line = line.trim();
                if (line.equalsIgnoreCase("exit")) {
                    System.out.println("Goodbye!");
                    break;
                }
                if (line.equalsIgnoreCase("models")) {
                    System.out.println("Available models: " + ai.getModelInfo().keySet());
                    continue;
                }

                Map<String, Object> result = ai.processMessage(line);
                String response = (String) result.getOrDefault("response", "Sorry, I don't have a response.");
                String modelUsed = (String) result.getOrDefault("modelUsed", "unknown");
                System.out.println("AI (" + modelUsed + "): " + response + "\n");
            }
        }
    }
}
