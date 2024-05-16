import { Request, Response } from "express";
import Subscribers from "../../modles/Subscribers";
import Templet from "../../modles/Templet.model";
import jwt from "jsonwebtoken";

export async function renderTemplet(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const Templet: any = jwt.verify(id, process.env.JWT_SECRET);
    res.json(Templet);
  } catch (error) {
    console.log("Error rendering templet", error);
    res.json({
      title: "something went wrong",
      description: "Something went wrong try again later",
    });
  }
}

export async function createTemplet(req: Request, res: Response) {
  try {
    const { logo, title, website, user, templeteName } = req.body;
    
    //checking fro existing users
    const existingTemplet = await Templet.find({
      owner: user._id,
      templeteName,
    });

    if (existingTemplet[0]) {
      res.json({
        title: "Templet already exists",
        description: "you have already used this template try a new one",
      });
      return;
    }

    //creating a signed url based on the information
    const linkid = jwt.sign(
      { owner: user._id, logo, title, website, templeteName },
      process.env.JWT_SECRET
    );
    const link = `${process.env.NEXT_PUBLIC_HOST}/subscribe/${linkid}`;

    //creating a document in database
    const newTemplet = new Templet({
      owner: user._id,
      logo,
      title,
      website,
      templeteName,
      link
    });
    await newTemplet.save();

    //sending appropiate response
    res.json({
      title: "Templet saved successfully",
      description:
        "your templet was saved successfully share the link below for people to subscribe",
      link,
    });
  } catch (error) {
    console.log("Error generating templet", error);
    res.json({
      title: "something went wrong",
      description: "Something went wrong try again later",
    });
  }
}

export async function addSubscribers(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const obj: any = jwt.verify(id, process.env.JWT_SECRET);
    const { email } = req.body;

    const existingSubscriber = await Subscribers.find({
      
    });

    const newSubscriber = new Subscribers({
      email,
      subscribedTo: obj,
    });

    await newSubscriber.save();
  } catch (error) {
    console.log("error adding subscribers in templet", error);
    res.json({
      title: "something went wrong",
      description: "Something went wrong try again later",
    });
  }
}

export async function getdata(req: Request, res: Response) {
  try {
    const {user} = req.body;
    const templets = await Templet.find({
      owner:user._id
    });

    let links=[]
    templets.forEach((templet) =>{
      links.push(templet.link)
    })
    
    res.json(links)
  } catch (error) {
    console.log("error getting data it templet", error);
    res.json({
      title: "something went wrong",
      description: "Something went wrong try again later",
    });
  }
}
