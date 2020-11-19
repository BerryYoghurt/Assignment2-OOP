package eg.edu.alexu.eng.csed.calculator;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class Calculator {

    @GetMapping(value = "/add")
    public ResponseEntity<Double> add(@RequestParam(value = "x") double x, @RequestParam(value = "y") double y){
        double ans = x+y;
        if(ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);

    }

    @GetMapping("/subtract")
    public ResponseEntity<Double> subtract(@RequestParam(value = "x") double x, @RequestParam(value = "y") double y){
        double ans = x-y;
        if(ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);
    }

    @GetMapping("/multiply")
    public ResponseEntity<Double> multiply(@RequestParam(value = "x") double x, @RequestParam(value = "y") double y){
        double ans = x*y;
        if(ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);
    }

    @GetMapping("/divide")
    public ResponseEntity<Double> divide(@RequestParam(value = "x") double x, @RequestParam(value = "y") double y){
        double ans = x/y;
        if(ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);
    }

    @GetMapping("/square")
    public ResponseEntity<Double> square(@RequestParam(value = "x") double x){
        double ans = x*x;
        if(ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);
    }

    @GetMapping("/sqrt")
    public ResponseEntity<Double> sqrt(@RequestParam(value = "x") double x){
        Double ans;
        if(x > 0){
            ans = Math.sqrt(x);
        }else{
            ans = null;
        }
        if(ans != null && ans < Double.POSITIVE_INFINITY && ans > Double.NEGATIVE_INFINITY){
            return ResponseEntity.ok(ans);
        }
        return ResponseEntity.status(HttpStatus.INSUFFICIENT_STORAGE).body(ans);
    }
}
