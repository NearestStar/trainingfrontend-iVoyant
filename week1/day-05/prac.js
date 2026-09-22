async function getUser(){
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
        if (!response.ok){
            throw new Error("Request failed");
        }
        const result = await response.json();
        const { name, email } = result;
        console.log("Name: "+name);
        console.log("Email: "+email);
        }
        catch (error){
            console.log("Error:", error.message);
        }
        finally{
            console.log("Request Completed");
        }
};

getUser();