package eg.edu.alexu.eng.csed.calculator;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
class CalculatorApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void contextLoads() {
        //mvc.perform(MockMvcRequestBuilders.get("/3+4"))
    }

}
