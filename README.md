# Test Description

Run for 15 Years
Every Year:,Increment Age
If Auto Renew - Maintain Breed

Else No Auto-Renew:,Affinity = Payment_at_Purchase/Attribute_Price + (2 * Attribute_Promotions * Inertia_for_Switch)
If Breed_C,Switch to Breed_NC if Affinity < (Social_Grade * Attribute_Brand)
If Breed_NC,Switch to Breed_C if Affinity < (Social_Grade * Attribute_Brand * Brand_Factor)

Output:
Number of Agents in each Breed (At every Year)
Number of Breed_C Lost (Switched to Breed_NC)
Number of Breed_C Gained (Switch from Breed_NC)
Number of Breed_C Regained (Switched to NC, then back to C)


# Run Instructions

1. Open index.html in Firefox (Chrome has problems reading the local .csv)
2. Set your Brand Factor
3. Click Generate Results
