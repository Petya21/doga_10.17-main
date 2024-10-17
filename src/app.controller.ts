import { Controller, Get, Post, Body, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReservationDto } from './newReservation.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    private readonly orders: ReservationDto[] = [];

    @Get()
    @Render('welcome')
    getHello() {
        return { message: this.appService.getHello() };
    }

    @Get('order')
    @Render('index')
    orderForm() {
        return {
            errors: [],
            data: {},
            currentDate: new Date().toISOString().slice(0, 16)
        };
    }

    @Post('order')
    order(@Body() orderData: ReservationDto, @Res() response: Response) {
        const errors: string[] = [];

        if (!orderData.name) errors.push('A név megadása kötelező!');
        if (!orderData.email || !/\S+@\S+\.\S+/.test(orderData.email)) errors.push('Helytelen e-mail cím!');
        if (!orderData.dateTime || new Date(orderData.dateTime) < new Date()) errors.push('A dátum és időpont nem lehet a múltban!');
        if (!orderData.guests || orderData.guests < 1 || orderData.guests > 10) errors.push('A vendégek száma 1 és 10 között kell legyen!');

        if (errors.length > 0) {
            response.render('index', {
                errors,
                data: orderData,
                currentDate: new Date().toISOString().slice(0, 16),
            });
            return;
        }

        this.orders.push(orderData);
        response.redirect(303, '/success');
    }

    @Get('success')
    @Render('siker')
    orderSuccess() {
        return {
            message: 'Sikeresen leadta a rendelését!',
            ordersCount: this.orders.length,
        };
    }
}
