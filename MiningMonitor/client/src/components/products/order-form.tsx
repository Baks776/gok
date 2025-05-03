import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  customerName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phoneNumber: z.string().min(5, "Телефон должен содержать минимум 5 символов"),
  productId: z.string().min(1, "Пожалуйста, выберите продукт"),
  quantity: z.coerce.number().positive("Количество должно быть больше 0"),
  preferredDate: z.string().min(1, "Пожалуйста, выберите дату"),
  preferredTime: z.string().min(1, "Пожалуйста, выберите время"),
});

interface OrderFormProps {
  products: Array<{
    id: number;
    name: string;
  }>;
}

export default function OrderForm({ products }: OrderFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      productId: "",
      quantity: 1,
      preferredDate: "",
      preferredTime: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/orders", {
        ...data,
        productId: parseInt(data.productId),
        preferredDate: new Date(`${data.preferredDate}T${data.preferredTime}`).toISOString(),
      });
      
      if (response.ok) {
        toast({
          title: "Заявка отправлена",
          description: "Наша команда свяжется с вами в ближайшее время.",
        });
        
        form.reset();
      } else {
        throw new Error("Не удалось отправить заказ");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Возникла проблема при отправке вашего заказа. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Перевод названий продуктов на русский язык
  const translateProductName = (name: string) => {
    const translations: Record<string, string> = {
      '5-10mm Crushed Stone': 'Щебень 5-10мм',
      '10-20mm Crushed Stone': 'Щебень 10-20мм',
      '20-40mm Crushed Stone': 'Щебень 20-40мм',
      '40-70mm Crushed Stone': 'Щебень 40-70мм',
      'Sand': 'Песок',
      'Granite Chips': 'Гранитная крошка'
    };
    
    return translations[name] || name;
  };
  
  return (
    <Card className="bg-muted rounded-lg p-4" id="order-form">
      <h2 className="text-lg font-medium mb-4">Оформить заказ</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя/Название компании</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефона</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Продукт</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите продукт" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {translateProductName(product.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество (тонн)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value === "" ? "1" : e.target.value;
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Желаемая дата</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Желаемое время</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-accent text-white py-3 rounded-lg font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
